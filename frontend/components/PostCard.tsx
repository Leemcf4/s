import Link from "next/link"
import { Fragment, useEffect } from "react"

import dayjs from "dayjs"
import { Post } from "../types"
import relativeTime from "dayjs/plugin/relativeTime"
import Axios from "axios"
import classNames from "classnames"
import { PostCardButton } from "./PostCardButton"

import { useRouter } from "next/router"
import { useAuthState } from "../context/auth"

dayjs.extend(relativeTime)

interface PostCardProps {
  post: Post
  revalidate?: Function
}

export default function PostCard({
  post: {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  },
  revalidate,
}: PostCardProps) {
  const { authenticated } = useAuthState()

  const router = useRouter()

  const isSubPage = router.pathname === "/r/[sub]"

  const vote = async (value: number) => {
    if (!authenticated) router.push("/login")

    if (value === userVote) value = 0
    try {
      const res = await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      })

      revalidate()

      console.log(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      key={identifier}
      id={identifier}
      className="flex mx-2 mb-4 bg-white rounded"
    >
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames("icon-arrow-up", {
              "text-red-500": userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames("icon-arrow-down", {
              "text-blue-500": userVote === -1,
            })}
          ></i>
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center ">
          {!isSubPage && (
            <>
              <Link href={`/r/${subName}`}>
                <img
                  src={sub.imageUrl}
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                />
              </Link>
              <Link href={`/r/${subName}`}>
                <a className="text-xs font-bold cursor-pointer hover:underline">
                  /r/{subName}
                </a>
              </Link>
              <span className="mx-1">•</span>
            </>
          )}
          <p className="text-xs text-gray-400">
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a className="my-1 font-medium text lg">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}

        <div className="flex">
          <Link href={url}>
            <a>
              <PostCardButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} Comments</span>
              </PostCardButton>
            </a>
          </Link>
          <PostCardButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </PostCardButton>
          <PostCardButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </PostCardButton>
        </div>
      </div>
    </div>
  )
}
