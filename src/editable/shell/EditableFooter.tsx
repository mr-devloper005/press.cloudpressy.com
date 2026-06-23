'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="overflow-hidden bg-[#23245f] text-white">
      <div className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 lg:px-10">
        <div className="grid gap-6 border-b border-white/12 pb-10 lg:grid-cols-[0.9fr_1.1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-3">
              {['Leader', 'Momentum Leader', 'Regional Leader'].map((badge) => (
                <span key={badge} className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/85">
                  {badge}
                </span>
              ))}
            </div>
            <Link href="/" className="playful-wordmark mt-8 block text-[2.2rem] font-black uppercase tracking-[0.28em] sm:text-[3rem]">
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">{SITE_CONFIG.name}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd65a]">Explore</h3>
              <div className="mt-4 grid gap-3">
                <Link href="/search" className="text-sm font-bold text-white/82 transition hover:text-white">Search Archive</Link>
                <Link href="/about" className="text-sm font-bold text-white/82 transition hover:text-white">About</Link>
                <Link href="/contact" className="text-sm font-bold text-white/82 transition hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd65a]">Workspace</h3>
              <div className="mt-4 grid gap-3">
                {session ? (
                  <>
                    <Link href="/create" className="text-sm font-bold text-white/82 transition hover:text-white">Create Post</Link>
                    <button onClick={logout} className="text-left text-sm font-bold text-white/82 transition hover:text-white">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-bold text-white/82 transition hover:text-white">Sign In</Link>
                    <Link href="/signup" className="text-sm font-bold text-white/82 transition hover:text-white">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <Link href="/contact" className="text-sm font-bold text-white transition hover:text-[#ffd65a]">Request Pricing</Link>
            <Link href={session ? '/create' : '/signup'} className="inline-flex items-center gap-2 rounded-xl bg-[#3d63ff] px-6 py-4 text-sm font-black text-white shadow-[0_18px_36px_rgba(61,99,255,0.24)] transition hover:-translate-y-0.5 hover:bg-[#4b70ff]">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-6 py-8 text-sm text-white/70 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex flex-wrap gap-5">
            <span>Accessibility Statement</span>
            <span>Privacy Policy</span>
            <span>Contact &amp; Support</span>
          </div>
          <p className="text-center">Copyright © {year} {SITE_CONFIG.name}</p>
          <p className="text-left lg:text-right">{globalContent.footer?.bottomNote || 'Built for media distribution and public discovery.'}</p>
        </div>
      </div>
    </footer>
  )
}
