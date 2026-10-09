import { Button } from '@heroui/react'
import { SectionPage, Group, Field } from '../components/Fields.jsx'

const inputCls = 'w-full px-2.5 py-1.5 rounded-lg bg-content1 border border-divider text-sm outline-none focus:border-primary'
const itemLabel = 'text-[11px] font-medium text-foreground-500 mb-1'

function DocEntry({ entry, index, onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...entry, [field]: value })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end mb-3 p-3 rounded-xl border border-divider bg-content2">
      <div>
        <div className={itemLabel}>Document / Item</div>
        <input className={inputCls} type="text" value={entry.name || ''}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Document name or description" />
      </div>
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <div className={itemLabel}>Status / Notes</div>
          <input className={inputCls} type="text" value={entry.notes || ''}
            onChange={e => handleChange('notes', e.target.value)}
            placeholder="e.g. Signed, pending, attached" />
        </div>
        {index > 0 && (
          <Button isIconOnly size="sm" variant="light" radius="full" title="Remove" aria-label="Remove item"
            className="text-foreground-500 hover:text-danger" onPress={() => onRemove(index)}>
            ✕
          </Button>
        )}
      </div>
    </div>
  )
}

function DocumentGroup({ title, hint, items, field, data, onFieldChange }) {
  const list = items || [{ name: '', notes: '' }]

  const add = () => {
    const updated = [...list, { name: '', notes: '' }]
    onFieldChange(field, updated)
  }

  const update = (index, updatedEntry) => {
    const updated = list.map((e, i) => (i === index ? updatedEntry : e))
    onFieldChange(field, updated)
  }

  const remove = (index) => {
    const updated = list.filter((_, i) => i !== index)
    onFieldChange(field, updated.length ? updated : [{ name: '', notes: '' }])
  }

  return (
    <Group title={title} hint={hint}>
      {list.map((entry, index) => (
        <DocEntry key={index} entry={entry} index={index} onUpdate={update} onRemove={remove} />
      ))}
      <Button size="sm" variant="bordered" color="primary" className="mb-5" onPress={add}>+ Add Item</Button>
      <Field
        label="Additional Details"
        hint="Describe what documents you have, where they are filed, and any relevant context."
        value={data?.[`${field}Details`]}
        onChange={v => onFieldChange(`${field}Details`, v)}
        tall
      />
    </Group>
  )
}

export default function SectionIX({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange && onChange({ ...(data || {}), [field]: value })
  }

  return (
    <SectionPage title="IX. Appendices" intro="Keep the body of your business plan focused and readable. Supporting documents — contracts, licenses, research studies, and the like — belong in the Appendices, where readers can find them if they want to dig deeper. Reference them by name in the relevant sections of your plan so readers know they exist.">
      <DocumentGroup title="Agreements" hint="Leases, contracts, purchase orders, letters of intent." items={data?.agreements} field="agreements" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Intellectual Property" hint="Trademarks, licenses, patents, or pending applications." items={data?.intellectualProperty} field="intellectualProperty" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Resumes — Owners & Key Team Members" hint="Attach or describe resumes for owners and key team members." items={data?.resumes} field="resumes" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Marketing Materials" hint="Ads, campaigns, brand assets, or sample content." items={data?.marketingMaterials} field="marketingMaterials" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Press & Publicity" hint="Any media coverage or public relations materials." items={data?.pressPublicity} field="pressPublicity" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Blueprints or Floor Plans" hint="For physical locations or buildouts." items={data?.blueprints} field="blueprints" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Equipment List" hint="Itemized inventory of major equipment." items={data?.equipmentList} field="equipmentList" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Market Research" hint="Studies, surveys, data sources, or third-party reports that support your projections." items={data?.marketResearch} field="marketResearch" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Collateral" hint="A list of assets that could be used to secure financing." items={data?.collateral} field="collateral" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Insurance Policy Summaries or Binders" hint="Summarize your insurance coverage." items={data?.insurance} field="insurance" data={data} onFieldChange={handleChange} />
      <Group title="Data Privacy & Cybersecurity Policy" hint="If you are collecting customer data, describe your privacy policy, cybersecurity measures, and any compliance certifications.">
        <Field
          label="Data Privacy & Cybersecurity Policy"
          hint="Outline how you collect, store, protect, and handle customer data."
          value={data?.dataPrivacyPolicy}
          onChange={v => handleChange('dataPrivacyPolicy', v)}
          tall
        />
      </Group>
      <DocumentGroup title="Product Photos, Prototypes, or Technical Specifications" hint="Visuals or technical details of your product or service." items={data?.productSpecs} field="productSpecs" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Letters of Intent — Prospective Customers or Partners" hint="Letters of intent from prospective customers or partners." items={data?.lettersOfIntent} field="lettersOfIntent" data={data} onFieldChange={handleChange} />
      <DocumentGroup title="Other Supporting Documents" hint="Anything else that strengthens your case or supports the assumptions you've made throughout the plan. Photos of your proposed location, product illustrations, patent drawings, or market growth charts can all help readers visualize what you're building." items={data?.otherDocuments} field="otherDocuments" data={data} onFieldChange={handleChange} />
    </SectionPage>
  )
}