import Axios from "axios"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { FormEvent, useState } from "react"
import classNames from "classnames"
import e from "express"
import { useRouter } from "next/router"

export default function create() {
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<Partial<any>>({})

  const router = useRouter()

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const res = await Axios.post(`/subs`, { name, title, description })

      router.push(`/r/${res.data.name}`)
    } catch (err) {
      console.log(err)
      setErrors(err.response.data)
    }
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Seddit</title>
      </Head>
      <div
        className="w-40 h-screen bg-cover"
        style={{ backgroundImage: "url('/images/purple-brick.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-120">
          <h1 className="mb-2 text-lg font-medium">Create Seddit</h1>
          <hr />
          <form onSubmit={submitForm}>
            <div className="my-6">
              <p className="font-medium">
                Name <span className="text-blue-400">*</span>
              </p>
              <p className="mb-2 text-xs text-gray-400">
                Seddit name can't be changed once created
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className={classNames(
                  "w-full p-3 text-blue-600 border border-gray-200 rounded input hover:border-gray-400 focus:outline-none",
                  { "border-red-500:": errors.name }
                )}
              ></input>
              <small className="font-medium text-red-500">{errors.name}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">
                Title <span className="text-blue-400">*</span>
              </p>
              <p className="mb-2 text-xs text-gray-400">Pick a good one</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className={classNames(
                  "w-full p-3 text-blue-600 border border-gray-200 rounded input hover:border-gray-400 focus:outline-none",
                  { "border-red-500:": errors.title }
                )}
              ></input>
              <small className="font-medium text-red-500">{errors.title}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">
                Description <span className="text-blue-400">*</span>
              </p>
              <p className="mb-2 text-xs text-gray-400">Let the people know</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-blue-600 border border-gray-200 rounded input hover:border-gray-400 focus:outline-none"
              ></textarea>
              <small className="font-medium text-red-500">
                {errors.description}
              </small>
            </div>
            <div className="flex justify-center">
              <button className="px-4 py-1 rounded blue button">
                Create Seddit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie
    if (!cookie) throw new Error("No auth token cookie")

    await Axios.get("/auth/me", { headers: { cookie } })

    return { props: {} }
  } catch (err) {
    res.writeHead(307, { Location: "/login" }).end()
  }
}
