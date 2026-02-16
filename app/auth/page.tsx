"use client"
import Link from 'next/link';
import Image from 'next/image';

export default function JoinUs() {
  return (
    <div className="min-h-screen flex font-poppins">
      {/* Left Side: Image */}
      <div className="relative w-[460px] hidden lg:block">
        <Image
          src="/images/pic2.jpg"
          alt="Workspace"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <Image src="/icons/logo.png"  alt="Workspace" width={192} height={42} className="absolute bottom-5 left-5  z-index-1" />
        
      </div>

      {/* right side image */}
      <div className="flex-1 flex flex-col bg-gray-50">
        
        {/* top heeader */}
        <div className="p-8 text-right">
          <span className="text-gray-400 text-sm">Already have an account? </span>
          <Link href="/auth/login" className="text-blue-500 text-sm font-semibold hover:underline">
            Sign In
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[450px] px-6">
            
            <div className="mb-10">
              <h1 className="font-bold text-3xl text-gray-900 mb-2">Join Us!</h1>
              <p className="text-gray-500 text-sm">
                To begin this journey, tell us what type of account you'd be opening.
              </p>
            </div>

            <div className="space-y-4">
              {/* Manager Box */}
              <Link href="/auth/signup?role=manager" className="user-box group">
                <div className="flex items-center gap-4">
                  <div className="blue-circle-icon">
                    <Image src="/icons/user.png" alt="Icon" width={16} height={16} className="invert brightness-0" />
                  </div>
                  <div className="text-left">
                    <div className="user-role">Manager</div>
                    <div className="text-[13px] text-gray-500 w-[250px]">Signup as a manager to manage the tasks and bugs</div>
                  </div>
                </div>
                <div className='hidden group-hover:flex'>
                  <Image src="/icons/arrow-right.png" alt="Arrow" width={16} height={16}
                 />
                </div>
                
              </Link>

              {/* Developer Box */}
              <Link href="/auth/signup?role=developer" className="user-box group ">
                <div className="flex items-center gap-4">
                  <div className="blue-circle-icon-ghost">
                    <Image src="/icons/briefcase.png" alt="Icon" width={16} height={16} className="text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="user-role">Developer</div>
                    <div className="text-[13px] text-gray-500 w-[270px]">Signup as a Developer to assign the relevant task to QA</div>
                  </div>
                  <div className='hidden group-hover:flex'>
                     <Image src="/icons/arrow-right.png" alt="Arrow" width={16} height={16}
                 />
                   </div>
                </div>
      
              </Link>

              {/* QA Box */}
              <Link href="/auth/signup?role=sqa" className="user-box group">
                <div className="flex items-center gap-4">
                  <div className="blue-circle-icon-ghost">
                    <Image src="/icons/Vector.png" alt="Icon" width={16} height={16} className="text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="user-role">QA</div>
                    <div className="text-[13px] text-gray-500 w-[260px]">Signup as a QA to create the bugs and report in tasks</div>
                  </div>
                </div>
                <div className='hidden group-hover:flex'>
                  <Image src="/icons/arrow-right.png" alt="Arrow" width={16} height={16}
                 />
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}