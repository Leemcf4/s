import Axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { Fragment, useEffect, useState } from "react"
import { useAuthDispatch, useAuthState } from "../context/auth"
import { Sub } from "../types"

const Nav: React.FC = () => {
  const [name, setName] = useState("")
  const [subs, setSubs] = useState<Sub[]>([])
  const [timer, setTimer] = useState(null)

  const { authenticated, user, loading } = useAuthState()

  const dispatch = useAuthDispatch()

  const router = useRouter()

  const logout = () => {
    Axios.get("/auth/logout")
      .then(() => {
        dispatch("LOGOUT")
        window.location.reload()
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    if (name.trim() === "") {
      setSubs([])
      return
    }
    searchSubs()
  }, [name])

  const searchSubs = async () => {
    clearTimeout(timer)
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await Axios.get(`/subs/search/${name}`)
          setSubs(data)
        } catch (err) {
          console.log(err)
        }
      }, 250)
    )
  }

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`)
    setName("")
  }

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a href="">
            <img
              src="/images/reddit-logo.png"
              className="object-contain mr-2"
              style={{
                minHeight: "30px",
                minWidth: "30px",
                width: "30px",
                height: "30px",
              }}
            />
          </a>
        </Link>
        <span className="hidden text-2xl font-semibold lg:block">
          <Link href="/">Seddit</Link>
        </span>
      </div>
      <div className="max-w-full px-4 w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-400 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            placeholder="search"
            type="text"
            className="py-1 pr-3 bg-transparent rounded focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div
            className="absolute left-0 right-0 bg-white"
            style={{ top: "100%" }}
          >
            {subs?.map((sub) => (
              <div
                className="flex items-center object-contain px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => goToSub(sub.name)}
              >
                <Image
                  className="rounded-full"
                  src={sub.imageUrl}
                  alt="sub"
                  height={(8 * 16) / 4}
                  width={(8 * 16) / 4}
                ></Image>
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-500">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              className="w-20 py-1 mr-4 leading-5 lg:w-32 empty blue button sm:block"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="w-20 py-1 mr-4 leading-5 lg:w-32 empty blue button sm:block">
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a className="hidden w-20 py-1 leading-5 lg:w-32 bg-gray-50 blue button sm:block">
                  Sign up
                </a>
              </Link>
            </Fragment>
          ))}
      </div>
    </div>
  )
}

export default Nav
