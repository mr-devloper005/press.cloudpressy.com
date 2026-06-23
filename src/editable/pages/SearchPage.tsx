import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const feature = index % 6 === 0

  return (
    <Link
      href={href}
      className={`group block rounded-[2rem] border border-[#d5dded] bg-white p-5 shadow-[0_16px_36px_rgba(17,22,68,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(17,22,68,0.12)] ${feature ? 'md:col-span-2' : ''}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`inline-flex rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${feature ? 'bg-[#23245f] text-white' : 'bg-[#ea5252] text-white'}`}>
          {taskLabel}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1f2551]/40">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h2 className={`playful-serif mt-4 line-clamp-3 font-black leading-[1.03] tracking-[-0.04em] text-[#1f2551] ${feature ? 'text-3xl sm:text-[2rem]' : 'text-2xl'}`}>{post.title}</h2>
      {summary ? <p className={`mt-4 font-semibold text-[#1f2551]/65 ${feature ? 'line-clamp-4 text-base leading-8' : 'line-clamp-3 text-sm leading-7'}`}>{summary}</p> : null}
      <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3d63ff]">Open result <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fffaf1] text-[#1f2551]">
        <section className="bg-[#23245f] text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[2.5rem] border border-white/10 bg-white/6 p-8 shadow-[0_28px_70px_rgba(9,10,36,0.18)] sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#ffd65a]">
                  <Sparkles className="h-4 w-4" /> {pagesContent.search.hero.badge}
                </div>
                <h1 className="playful-serif mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-7xl">{pagesContent.search.hero.title}</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/76">{pagesContent.search.hero.description}</p>
                <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.18em] text-white/72">
                  <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Keyword-led discovery</span>
                  <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Task filtering</span>
                  <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Fast archive browsing</span>
                </div>
              </div>

              <form action="/search" className="rounded-[2.3rem] bg-white p-6 text-[#1f2551] shadow-[0_24px_54px_rgba(17,22,68,0.16)] sm:p-8">
                <input type="hidden" name="master" value="1" />
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#ea5252]">Search filters</p>
                <label className="mt-4 flex items-center gap-3 rounded-[1rem] border border-[#d5dded] bg-[#fbfcff] px-4 py-3">
                  <Search className="h-5 w-5 text-[#1f2551]/45" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-current/35" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-[1rem] border border-[#d5dded] bg-[#fbfcff] px-4 py-3">
                    <Filter className="h-4 w-4 text-[#1f2551]/45" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
                  </label>
                  <select name="task" defaultValue={task} className="rounded-[1rem] border border-[#d5dded] bg-[#fbfcff] px-4 py-3 text-sm font-black outline-none">
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-[1rem] bg-[#3d63ff] px-6 text-sm font-black text-white transition hover:bg-[#4b70ff]" type="submit">Search</button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1f2551]/50">{results.length} results</p>
              <h2 className="playful-serif mt-2 text-4xl font-black tracking-[-0.04em] text-[#1f2551]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-xl border border-[#d5dded] bg-white px-5 py-3 text-xs font-black uppercase text-[#1f2551] shadow-[0_10px_24px_rgba(17,22,68,0.04)]">
              Browse latest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-[2rem] border border-dashed border-[#d5dded] bg-white p-10 text-center">
              <p className="text-2xl font-black tracking-[-0.04em] text-[#1f2551]">No matching posts found.</p>
              <p className="mt-3 text-sm font-semibold text-[#1f2551]/60">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
