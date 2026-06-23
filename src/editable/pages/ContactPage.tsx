'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach the team for account, publishing, or site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#fffaf1] text-[#1f2551]">
        <section className="bg-[#23245f] text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="rounded-[2.4rem] border border-white/10 bg-white/6 p-8 shadow-[0_28px_70px_rgba(9,10,36,0.18)] sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffd65a]">{pagesContent.contact.eyebrow}</p>
              <h1 className="playful-serif mt-4 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">{pagesContent.contact.title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/76">{pagesContent.contact.description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="rounded-[2.2rem] bg-[#23245f] p-6 text-white shadow-[0_24px_60px_rgba(9,10,36,0.18)] sm:p-8">
              {desks.map((desk, index) => (
                <div key={desk.title} className="border-b border-white/12 py-6 first:pt-0 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between"><desk.icon className="h-5 w-5 text-[#ffd65a]" /><span className="text-xs font-black text-white/45">0{index + 1}</span></div>
                  <h2 className="playful-serif mt-5 text-2xl font-black">{desk.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/68">{desk.body}</p>
                </div>
              ))}
            </aside>
            <div className="story-surface rounded-[2.2rem] border border-[#d5dded] bg-white p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ea5252]">Send a message</p>
              <h2 className="playful-serif mt-3 text-4xl font-black text-[#1f2551]">{pagesContent.contact.formTitle}</h2>
              <div className="mt-6">
                <EditableContactLeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
