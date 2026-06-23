import Link from 'next/link'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { pagesContent } from '@/editable/content/pages.content'
import { CompactIndexCard, getEditableExcerpt, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const safeArchiveHref = '/search'

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function statCopy(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return [
    {
      value: `${Math.max(posts.length, 1)}+`,
      title: 'Featured updates ready to browse',
      description: 'Fresh headlines, summaries, and detail pages stay visible without changing the underlying publishing flow.',
    },
    {
      value: `${Math.max(timeSections.length, 3)}+`,
      title: 'Topic lanes for faster discovery',
      description: 'Visitors can move from broad distribution themes to specific story angles with less friction.',
    },
    {
      value: `${Math.max(Math.min(posts.length * 2, 48), 9)}+`,
      title: 'Visual entry points across the homepage',
      description: 'Feature cards, list cards, image-first modules, and briefing blocks keep the layout varied and readable.',
    },
  ]
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const side = posts.slice(1, 3)
  const trending = posts.slice(3, 7)
  const heroTitle = pagesContent.home.hero.title.join(' ')

  return (
    <section className="overflow-hidden bg-[#23245f] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        {!lead ? (
          <div className="rounded-[2.5rem] border border-white/10 bg-white/6 p-8 sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd65a]">{pagesContent.home.hero.badge}</p>
            <h1 className="playful-serif mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">{heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{pagesContent.home.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={safeArchiveHref} className="inline-flex items-center gap-2 rounded-xl bg-[#3d63ff] px-6 py-4 text-sm font-black text-white">
                Browse Updates <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-black text-white">
                Request a Plan
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.18fr_1fr] lg:items-start">
            <div className="self-start rounded-[2.5rem] border border-white/10 bg-white/6 p-8 shadow-[0_30px_70px_rgba(9,10,36,0.2)] sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em]">
                <Sparkles className="h-4 w-4 text-[#ffd65a]" /> Featured Distribution
              </div>
              <h2 className="playful-serif mt-6 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">{lead.title}</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{getEditableExcerpt(lead, 180)}</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-[2.4rem] border border-white/10 bg-white/6 p-7 shadow-[0_30px_70px_rgba(9,10,36,0.2)] sm:p-9">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd65a]">{pagesContent.home.hero.badge}</p>
                <h1 className="playful-serif mt-5 text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-[4.6rem]">
                  Distribution with {SITE_CONFIG.name}
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">{pagesContent.home.hero.description}</p>
                <form action="/search" className="mt-8 flex overflow-hidden rounded-[1.3rem] border border-white/12 bg-white/8">
                  <div className="flex items-center pl-4 text-white/65">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    name="q"
                    type="search"
                    placeholder={pagesContent.home.hero.searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-white/45"
                  />
                  <button className="bg-[#3d63ff] px-5 text-xs font-black uppercase tracking-[0.14em] text-white">Search</button>
                </form>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={safeArchiveHref} className="inline-flex items-center gap-2 rounded-xl bg-[#3d63ff] px-6 py-4 text-sm font-black text-white">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/18 px-6 py-4 text-sm font-black text-white">
                    Request Pricing
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {side.map((post, index) => (
                  <div key={post.id} className="group rounded-[1.8rem] border border-white/10 bg-white/6 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ffd65a]">{index === 0 ? 'Coverage lane' : 'Media note'}</p>
                    <h3 className="mt-3 text-xl font-black leading-tight tracking-[-0.03em] text-white">{post.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/75">{getEditableExcerpt(post, 120)}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5">
                <div className="flex items-end justify-between border-b border-white/12 pb-3">
                  <h2 className="text-xl font-black uppercase tracking-[0.08em]">Trending now</h2>
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ffd65a]">Live</span>
                </div>
                <div className="mt-2">
                  {trending.map((post, index) => <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const support = posts[4] || posts[0]
  const stats = statCopy(posts, timeSections)
  const railPosts = posts.slice(5, 11).length ? posts.slice(5, 11) : posts.slice(1, 7)
  if (!support) return null

  return (
    <section className="bg-[#fffaf1]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="px-2 sm:px-4">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ea5252]">Turn every announcement into a wider campaign</p>
            <h2 className="playful-serif mt-4 max-w-xl text-5xl font-black leading-[0.94] tracking-[-0.05em] text-[#1f2551] sm:text-6xl">
              Make each story easier to discover, scan, and follow.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#1f2551]/72">
              Organize media distribution with a search-first experience, visual hierarchy, and story cards that feel intentional instead of recycled.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-[#e7dece] bg-white p-8 shadow-[0_30px_70px_rgba(17,22,68,0.08)] sm:p-10">
            <div className="inline-flex rounded-full bg-[#23245f] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              Spotlight story
            </div>
            <h3 className="playful-serif mt-6 text-4xl font-black leading-[0.96] tracking-[-0.05em] text-[#1f2551] sm:text-5xl">{support.title}</h3>
            <p className="mt-5 text-base leading-8 text-[#1f2551]/72">{getEditableExcerpt(support, 180)}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-[#e7dece] pt-10 lg:grid-cols-3">
          {stats.map((item) => (
            <article key={item.title} className="border-l border-[#e7dece] pl-0 lg:pl-8 first:border-l-0">
              <h3 className="max-w-sm text-4xl font-black uppercase leading-[0.98] tracking-[-0.05em] text-[#ea6a42] sm:text-6xl">{item.value}</h3>
              <p className="mt-4 max-w-sm text-2xl font-black leading-tight tracking-[-0.03em] text-[#ea6a42]">{item.title}</p>
              <p className="mt-6 max-w-sm text-base leading-8 text-[#1f2551]/72">{item.description}</p>
            </article>
          ))}
        </div>

        {railPosts.length ? (
          <div className="mt-16">
            <div className="mb-6 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ea5252]">Latest stories</p>
                <h2 className="playful-serif mt-2 text-4xl font-black tracking-[-0.04em] text-[#1f2551] sm:text-5xl">Coverage across the desk</h2>
              </div>
              <Link href={safeArchiveHref} className="hidden text-sm font-black text-[#3d63ff] sm:inline-flex">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {railPosts.map((post, index) => (
                <div key={post.id} className="rounded-[1.8rem] border border-[#e7dece] bg-white p-5 shadow-[0_18px_40px_rgba(17,22,68,0.08)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ea5252]">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="playful-serif mt-3 text-2xl font-black leading-[1.02] tracking-[-0.04em] text-[#1f2551]">{post.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#1f2551]/68">{getEditableExcerpt(post, 120)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[8] || posts[0]
  const columns = posts.slice(9, 12).length ? posts.slice(9, 12) : posts.slice(1, 4)
  if (!feature) return null

  return (
    <section className="bg-[#fffaf1]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-12 text-center">
          <h2 className="playful-serif text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#1f2551] sm:text-6xl">
            Unparalleled reach feels more useful
            <br className="hidden sm:block" /> when the path is this clear.
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="rounded-[2.2rem] border border-[#d5dded] bg-[#23245f] p-8 text-white shadow-[0_26px_60px_rgba(17,22,68,0.16)] sm:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd65a]">Featured focus</p>
            <h3 className="playful-serif mt-5 text-4xl font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">{feature.title}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/76">{getEditableExcerpt(feature, 200)}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {columns.map((post, index) => (
              <article key={post.id} className="rounded-[1.8rem] border border-[#d5dded] bg-white p-6 shadow-[0_16px_34px_rgba(17,22,68,0.06)]">
                <p className="text-2xl font-black uppercase leading-tight tracking-[-0.03em] text-[#1f2551]">
                  {index === 0 ? 'Upload your press release' : index === 1 ? 'Choose your target audience' : 'Send it and track the response'}
                </p>
                <p className="mt-5 text-base leading-8 text-[#1f2551]/72">{getEditableExcerpt(post, 160)}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#3d63ff]">
                  Explore this story <ArrowRight className="h-4 w-4" />
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[2.2rem] bg-[#f4f7fb] px-6 py-10 text-center text-[#1f2551] shadow-[0_26px_70px_rgba(9,10,36,0.1)] sm:px-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#23245f] text-white">
            <span className="playful-wordmark text-lg font-black tracking-[0.18em]">{SITE_CONFIG.name}</span>
          </div>
          <p className="mx-auto mt-8 max-w-4xl text-3xl font-black leading-[1.24] tracking-[-0.04em] sm:text-5xl">
            Reach matters most when every update can be found quickly, read clearly, and shared with confidence.
          </p>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(3)
  const lead = source[0] || posts[0]
  const briefs = source.slice(1, 5)
  const spotlight = source[5] || posts[2] || lead
  if (!lead) return null

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div className="rounded-[2.4rem] border border-[#e7dece] bg-white p-8 shadow-[0_28px_70px_rgba(17,22,68,0.08)] sm:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ea5252]">Lead story</p>
            <h3 className="playful-serif mt-5 text-4xl font-black leading-[0.96] tracking-[-0.05em] text-[#1f2551] sm:text-5xl">{lead.title}</h3>
            <p className="mt-5 text-base leading-8 text-[#1f2551]/72">{getEditableExcerpt(lead, 200)}</p>
          </div>

          <div className="px-2 sm:px-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ea5252]">The most trusted media pros count on clarity</p>
            <h2 className="playful-serif mt-4 text-5xl font-black leading-[0.96] tracking-[-0.05em] text-[#1f2551] sm:text-6xl">
              Strong stories deserve a cleaner reading experience.
            </h2>
            <p className="mt-6 text-lg font-black italic text-[#1f2551]">Credibility improves when pages feel deliberate, readable, and easy to navigate.</p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#1f2551]/72">
              Use the homepage to introduce your latest updates, then guide visitors into detail pages, category archives, and related stories without losing momentum.
            </p>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#1f2551] px-6 py-4 text-sm font-black text-[#1f2551] transition hover:bg-[#1f2551] hover:text-white">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ea5252]">Resources</p>
              <h2 className="playful-serif mt-2 text-4xl font-black tracking-[-0.04em] text-[#1f2551] sm:text-5xl">Insights, trends, and stories to keep you ahead.</h2>
            </div>
            <Link href={safeArchiveHref} className="inline-flex items-center gap-2 rounded-xl border border-[#1f2551] px-5 py-3 text-sm font-black text-[#1f2551]">
              All Resources <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr_0.85fr]">
            <div className="rounded-[2rem] border border-[#d5dded] bg-[#23245f] p-8 text-white shadow-[0_26px_60px_rgba(17,22,68,0.16)]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd65a]">Cover feature</p>
              <h3 className="playful-serif mt-5 text-4xl font-black leading-[0.96] tracking-[-0.05em] sm:text-5xl">{spotlight.title}</h3>
              <p className="mt-5 text-base leading-8 text-white/76">{getEditableExcerpt(spotlight, 190)}</p>
            </div>
            <div className="grid gap-5">
              {briefs.slice(0, 2).map((post, index) => (
                <div key={post.id} className="rounded-[2rem] border border-[#e7dece] bg-white p-5 shadow-[0_16px_34px_rgba(17,22,68,0.06)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ea5252]">{String(index + 1).padStart(2, '0')}</p>
                  <h2 className="playful-serif mt-3 text-3xl font-black leading-[1.02] tracking-[-0.05em] text-[#1f2551]">{post.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[#1f2551]/70">{getEditableExcerpt(post, 190)}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[2rem] bg-[#23245f] p-5 text-white shadow-[0_26px_60px_rgba(17,22,68,0.16)]">
              <div className="border-b border-white/12 pb-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ffd65a]">The briefing</p>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.03em]">Quick reads for {taskLabel(primaryTask).toLowerCase()}</h3>
              </div>
              <div className="mt-3">
                {briefs.slice(2, 5).map((post, index) => (
                  <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <form action="/search" className="mt-16 grid gap-5 rounded-[2.3rem] border border-[#d8d9ef] bg-[#f5f7ff] p-6 shadow-[0_20px_50px_rgba(17,22,68,0.06)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="playful-serif text-4xl font-black tracking-[-0.04em] text-[#1f2551]">Search the full archive</h3>
            <p className="mt-2 text-sm leading-7 text-[#1f2551]/65">Explore every {taskLabel(primaryTask).toLowerCase()} published by {SITE_CONFIG.name}.</p>
          </div>
          <label className="flex overflow-hidden rounded-[1.2rem] border border-[#cfd4e7] bg-white lg:min-w-[430px]">
            <Search className="ml-4 mt-4 h-4 w-4 text-[#1f2551]/55" />
            <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm outline-none" />
            <button className="bg-[#3d63ff] px-6 text-xs font-black uppercase tracking-[0.14em] text-white">Search</button>
          </label>
        </form>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#fffaf1]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-8 rounded-[2.4rem] bg-[#23245f] px-6 py-8 text-white shadow-[0_28px_70px_rgba(9,10,36,0.18)] sm:px-8 sm:py-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div>
            <h2 className="playful-serif max-w-3xl text-6xl font-black leading-[0.94] tracking-[-0.06em] sm:text-7xl">
              Speak to an expert
              <br /> to get started
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/80">
              Share what you want to publish, promote, or organize. The experience stays simple while the underlying content system keeps doing its job.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {['Leader', 'Momentum Leader', 'Highest User Adoption', 'Regional Leader'].map((badge) => (
                <span key={badge} className="rounded-md border border-white/12 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#1f2551]">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 text-[#1f2551] shadow-[0_28px_70px_rgba(9,10,36,0.24)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-black tracking-[-0.03em]">Speak to an Expert</h3>
              <span className="text-sm font-black uppercase tracking-[0.16em] text-[#1f2551]/70">Step 1 of 3</span>
            </div>
            <div className="mt-6 h-2 rounded-full bg-[#e8edf8]">
              <div className="h-full w-1/3 rounded-full bg-[#3d63ff]" />
            </div>
            <div className="mt-6 rounded-[1.2rem] bg-[#eff3fb] p-5 text-sm leading-7 text-[#1f2551]/78">
              Answer a few questions and we&apos;ll route your request through the right lane.
            </div>
            <div className="mt-6">
              <EditableContactLeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
