"use client"
import Link from 'next/link'
import Image from 'next/image'
import RoleBox from '@/public/src/components/RoleBox'
import { roleOptions } from '@/public/src/constants/roleOptions'
import { JOIN_US_CONTENT } from '@/public/src/constants/JoinUsContent'

export default function JoinUs() {
  return (
    <div className="min-h-screen flex font-poppins">

      {/* Left side image - hidden on mobile */}
      <div className="relative w-115 hidden lg:block">
        <Image src="/images/pic2.jpg" alt="Workspace" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <Image src="/icons/logo.png" alt="Logo" width={192} height={42} className="absolute bottom-5 left-5 z-index-1" />
      </div>

      {/* Right side */}
      <div className="flex-1 flex flex-col bg-gray-50">

        <div className="p-6 text-right">
          <span className="text-gray-400 text-sm first-letter:uppercase">{JOIN_US_CONTENT.have_account}</span>
          <Link href="/auth/login" className="text-blue-500 text-sm font-semibold hover:underline">
            Sign In
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-112.5 px-6">

            <div className="mb-8">
              <h1 className="font-bold text-3xl text-gray-900 mb-2">{JOIN_US_CONTENT.heading}</h1>
              <p className="text-gray-500 text-sm">{JOIN_US_CONTENT.subheading}</p>
            </div>

            <div className="space-y-4">
              {roleOptions.map((option) => (
                <RoleBox key={option.role} {...option} />
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}