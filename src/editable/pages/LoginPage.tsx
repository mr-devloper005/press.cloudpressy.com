import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#fffaf1] text-[#1f2551]">
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
            <div className="rounded-[2.3rem] bg-[#23245f] p-8 text-white shadow-[0_24px_60px_rgba(9,10,36,0.18)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffd65a]">{pagesContent.auth.login.badge}</p>
              <h1 className="playful-serif mt-5 max-w-xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/75">{pagesContent.auth.login.description}</p>
            </div>
            <div className="story-surface rounded-[2.3rem] border border-[#d5dded] bg-white p-7 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ea5252]">Member access</p>
              <h2 className="playful-serif mt-3 text-4xl font-black text-[#1f2551]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-5 border-t border-[#d5dded] pt-5 text-sm text-[#1f2551]/65">New here? <Link href="/signup" className="font-black text-[#3d63ff] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
