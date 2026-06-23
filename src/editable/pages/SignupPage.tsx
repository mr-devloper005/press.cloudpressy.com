import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#fffaf1] text-[#1f2551]">
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="story-surface rounded-[2.3rem] border border-[#d5dded] bg-white p-7 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ea5252]">Create account</p>
              <h1 className="playful-serif mt-3 text-4xl font-black text-[#1f2551]">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-5 border-t border-[#d5dded] pt-5 text-sm text-[#1f2551]/65">Already have an account? <Link href="/login" className="font-black text-[#3d63ff] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
            </div>
            <div className="rounded-[2.3rem] bg-[#23245f] p-8 text-white shadow-[0_24px_60px_rgba(9,10,36,0.18)] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffd65a]">{pagesContent.auth.signup.badge}</p>
              <h2 className="playful-serif mt-5 max-w-xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl">{pagesContent.auth.signup.title}</h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/68">{pagesContent.auth.signup.description}</p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
