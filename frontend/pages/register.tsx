import Axios from "axios"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useState } from "react"

import InputGroup from "../components/InputGroup"
import { useAuthState } from "../context/auth"

export default function Register() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [agreement, setAgreement] = useState(false)
  const [errors, setErrors] = useState<any>({})

  const router = useRouter()

  const { authenticated } = useAuthState()

  if (authenticated) router.push("/")

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()

    if (!agreement) {
      setErrors({ ...errors, agreement: "You must agree, yo" })
      return
    }

    try {
      await Axios.post("/auth/register", {
        email,
        password,
        username,
      })

      router.push("/login")
    } catch (err) {
      setErrors(err.response.data)
    }
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>

      <div
        className="w-40 h-screen bg-cover"
        style={{ backgroundImage: "url('/images/purple-brick.jpg')" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />

              <label className="text-xs cursor-pointer" htmlFor="agreement">
                I agree to get emails about cool stuff on Seddit
              </label>
              <small className="block text-red-600 medium-font">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              classname="mb-2"
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="email"
              error={errors.email}
            />
            <InputGroup
              classname="mb-2"
              type="username"
              value={username}
              setValue={setUsername}
              placeholder="username"
              error={errors.username}
            />
            <InputGroup
              classname="mb-4"
              type="password"
              value={password}
              setValue={setPassword}
              placeholder="password"
              error={errors.password}
            />
            <button className="w-full p-3 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
              Sign Up
            </button>
          </form>
          <small>
            Already a seddit lad?
            <Link href="/login">
              <a className="ml-1 text-blue-500">Sign In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}
