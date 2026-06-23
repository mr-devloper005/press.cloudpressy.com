import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#fffaf1] text-[#1f2551]">
        <section className="bg-[#23245f] text-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="rounded-[2.4rem] border border-white/10 bg-white/6 p-8 shadow-[0_28px_70px_rgba(9,10,36,0.18)] sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ffd65a]">{pagesContent.about.badge}</p>
              <h1 className="playful-serif mt-5 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                A sharper, calmer way to present stories and public updates.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/76">{pagesContent.about.description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="story-surface rounded-[2.2rem] border border-[#d5dded] bg-white p-7 sm:p-9 lg:p-10">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#ea5252]">About {SITE_CONFIG.name}</p>
              <p className="playful-serif mt-6 text-3xl font-bold leading-[1.25] text-[#1f2551] sm:text-4xl">{pagesContent.about.description}</p>
              <div className="article-content mt-8 space-y-6">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="rounded-[1.8rem] border border-[#d5dded] bg-[#f5f7ff] p-6 shadow-[0_16px_36px_rgba(17,22,68,0.06)] sm:p-7">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ea5252]">0{index + 1}</p>
                  <h2 className="playful-serif mt-4 text-2xl font-black leading-tight text-[#1f2551]">{value.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#1f2551]/65">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="pb-12 sm:pb-14 lg:pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2.2rem] bg-[#23245f] px-7 py-10 text-white shadow-[0_28px_70px_rgba(9,10,36,0.18)] sm:px-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="playful-serif max-w-3xl text-4xl font-black leading-[0.96] sm:text-5xl">Read the updates shaping the conversation.</h2>
                <Link href="/search" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#3d63ff] px-6 py-4 text-sm font-black text-white">
                  Explore the archive
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
