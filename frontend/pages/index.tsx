import Axios from "axios"
import Head from "next/head"
import { Fragment, useEffect, useState } from "react"
import dayjs from "dayjs"

import { Post, Sub } from "../types"
import relativeTime from "dayjs/plugin/relativeTime"
import { GetServerSideProps } from "next"
import PostCard from "../components/PostCard"
import useSWR, { useSWRInfinite } from "swr"
import Image from "next/image"
import Link from "next/link"
import { useAuthState } from "../context/auth"

dayjs.extend(relativeTime)

export default function Home() {
  const [watchedPost, setWatchedPost] = useState("")

  // const { data: {}, revalidate } = useSWR<Post[]>("/posts")
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs")

  const { authenticated } = useAuthState()

  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating,
    revalidate,
  } = useSWRInfinite<Post[]>((index) => `posts?page=${index}`)

  const isLoadingInitialData = !data && !error
  const posts: Post[] = data ? [].concat(...data) : []

  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get("/posts")
  //     .then((res) => setPosts(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    if (!posts || posts.length === 0) return

    const id = posts[posts.length - 1].identifier

    if (id !== watchedPost) {
      setWatchedPost(id)
      watchElement(document.getElementById(id))
    }
  }, [posts])

  const watchElement = (element: HTMLElement) => {
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log("reached bottom")
          setPage(page + 1)
          observer.unobserve(element)
        }
      },
      { threshold: 1 }
    )
    observer.observe(element)
  }
  return (
    <Fragment>
      <Head>
        <title>Seddit</title>
      </Head>

      <div className="container flex pt-4 mx-auto">
        <div className="w-full px-3 md:w-160 md:p-0">
          {isLoadingInitialData && (
            <p className="text-lg text-center">Loading..</p>
          )}
          {posts?.map((post) => (
            <PostCard
              key={post.identifier}
              post={post}
              revalidate={revalidate}
            ></PostCard>
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading..</p>
          )}
        </div>
        <div className="hidden ml-6 md:block w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">Top Seddits</p>
            </div>
            {topSubs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-2 text-xs border-b"
              >
                <div className="">
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        className="rounded-full cursor-pointer"
                        src={sub.imageUrl}
                        alt="sub"
                        width={(6 * 16) / 4}
                        height={(6 * 16) / 4}
                      ></Image>
                    </a>
                  </Link>
                </div>
                <Link href={`/r/${sub.name}`}>
                  <a className="ml-2 font-bold hover:cursor-pointer">
                    /r/{sub.name}
                  </a>
                </Link>
                <p className="ml-auto font-medium">{sub.postCount}</p>
              </div>
            ))}
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">Create Seddit </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get("/posts");

//     return { props: { posts: res.data } };
//   } catch (err) {
//     return { props: { error: "Something went wrong" } };
//   }
// };
