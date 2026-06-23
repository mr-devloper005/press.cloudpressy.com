'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Globe, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const links = [
    { label: 'Resources', href: '/search' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#23245f] text-white shadow-[0_20px_60px_rgba(10,12,38,0.22)]">
      <div className="mx-auto flex min-h-[86px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/5 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="min-w-0 shrink-0">
          <span className="playful-wordmark block truncate text-[1.65rem] font-black uppercase tracking-[0.32em] text-white sm:text-[2.35rem]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-white transition hover:text-[#ffd65a]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <Link href={session ? '/create' : '/login'} className="text-sm font-bold text-white transition hover:text-[#ffd65a]">
            {session ? 'Create' : 'Sign In'}
          </Link>
          <Link href={session ? '/create' : '/signup'} className="inline-flex items-center gap-2 rounded-xl bg-[#3d63ff] px-6 py-4 text-sm font-black text-white shadow-[0_18px_36px_rgba(61,99,255,0.25)] transition hover:-translate-y-0.5 hover:bg-[#4b70ff]">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/search" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/8 text-white transition hover:bg-white/14" aria-label="Search archive">
            <Search className="h-5 w-5" />
          </Link>
          <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-white/8 xl:inline-flex">
            <Globe className="h-5 w-5" />
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#1d1e52] px-4 py-4 lg:hidden">
          <div className="grid gap-3">
            <form action="/search" className="flex overflow-hidden rounded-2xl border border-white/10 bg-white/8">
              <input
                name="q"
                type="search"
                placeholder="Search stories, categories, and updates"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/45"
              />
              <button className="border-l border-white/10 px-4 text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>
            {links.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white">
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-[#3d63ff] px-4 py-3 text-sm font-black text-white">
                  Create Post
                </Link>
                <button onClick={logout} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-bold text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-[#3d63ff] px-4 py-3 text-sm font-black text-white">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
