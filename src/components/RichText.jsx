import { createContext, useContext, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import DOMPurify from 'isomorphic-dompurify'
import { apiFetch } from '../api.js'

/* ── Print / read-only mode ──────────────────────────────────
   When active, rich fields render sanitized HTML instead of
   mounting an editor (print export + vitest-friendly).       */

export const PrintModeContext = createContext(false)

/* ── Render pipeline ─────────────────────────────────────────
   Stored values are HTML; sanitize on render. Legacy plaintext
   contents render as-is (escaped, paragraphs preserved).      */

const HTML_RE = /<(p|br|h[2-3]|ul|ol|li|b|strong|i|em|u|s|strike|a|img|blockquote|code|hr)[\s/>]/i

export function renderRich(value) {
  const s = String(value ?? '')
  if (!s.trim()) return ''
  if (!HTML_RE.test(s)) {
    const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    return esc.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')
  }
  return DOMPurify.sanitize(s)
}

export default function RichText({ value, onChange, placeholder = 'Write something…', tall = false }) {
  const printMode = useContext(PrintModeContext)
  const syncing = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content: String(value ?? ''),
    onUpdate: ({ editor }) => {
      if (syncing.current) return
      if (onChange) onChange(editor.getHTML())
    },
  }, [])

  // Sync external value changes (AI draft accept, section reload) into the editor
  useEffect(() => {
    if (!editor) return
    const incoming = String(value ?? '')
    if (incoming !== editor.getHTML()) {
      syncing.current = true
      try {
        editor.commands.setContent(incoming, { emitUpdate: false })
      } finally {
        syncing.current = false
      }
    }
  }, [value, editor])

  if (printMode) {
    return <div className="rt-view" dangerouslySetInnerHTML={{ __html: renderRich(value) }} />
  }

  if (!editor) {
    return <div className="rounded-xl border border-divider bg-content1 h-24" />
  }

  return (
    <div className="rounded-xl border border-divider bg-content1 overflow-hidden transition-colors focus-within:border-primary">
      <Toolbar editor={editor} />
      <div className={`rt-content px-4 py-3 ${tall ? 'rt-content--tall' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

/* ── Toolbar ───────────────────────────────────────────────── */

function Toolbar({ editor }) {
  const item = (label, title, run, active) => (
    <button
      type="button"
      title={title}
      onMouseDown={e => e.preventDefault()}
      onClick={run}
      className={`h-7 min-w-7 px-1.5 rounded-md text-xs font-medium transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'text-foreground-500 hover:bg-content3 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )

  const chain = () => editor.chain().focus()

  const fileRef = { current: null }

  const insertImage = async (file) => {
    if (!file) return
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) { alert('Only PNG / JPEG / WebP / GIF images.') ; return }
    if (file.size > 5 * 1024 * 1024) { alert('Image exceeds 5 MB limit.'); return }
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await apiFetch('/api/uploads', {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.status)
      const { url } = await res.json()
      editor.chain().focus().setImage({ src: url, alt: file.name }).run()
    } catch (e) {
      alert(`Image upload failed: ${e.message}`)
    }
  }

  const pickImage = () => {
    let inp = pickImage._input
    if (!inp) {
      inp = document.createElement('input')
      inp.type = 'file'
      inp.accept = 'image/png,image/jpeg,image/webp,image/gif'
      inp.onchange = () => { if (inp.files?.[0]) insertImage(inp.files[0]); inp.value = '' }
      pickImage._input = inp
    }
    inp.click()
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href
    const url = window.prompt('Link URL', previous || 'https://')
    if (url === null) return
    if (url === '') {
      chain().extendMarkRange('link').unsetLink().run()
    } else {
      chain().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-divider bg-content2">
      {item('B', 'Bold', () => chain().toggleBold().run(), editor.isActive('bold'))}
      {item('I', 'Italic', () => chain().toggleItalic().run(), editor.isActive('italic'))}
      {item('U', 'Underline', () => chain().toggleUnderline().run(), editor.isActive('underline'))}
      <span className="w-px h-4 bg-divider mx-1" />
      {item('H2', 'Heading 2', () => chain().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
      {item('H3', 'Heading 3', () => chain().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
      <span className="w-px h-4 bg-divider mx-1" />
      {item('• List', 'Bullet list', () => chain().toggleBulletList().run(), editor.isActive('bulletList'))}
      {item('1. List', 'Numbered list', () => chain().toggleOrderedList().run(), editor.isActive('orderedList'))}
      <span className="w-px h-4 bg-divider mx-1" />
      {item('🔗', 'Link', setLink, editor.isActive('link'))}
      {item('🖼', 'Insert image', pickImage, editor.isActive('image'))}
    </div>
  )
}