"use client";
import Image from "next/image";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchSkillById } from "@/services/products";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { useRouter } from "next/navigation";
interface Props {
  skillId: string;
}

export const SkillViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden">
        <div className="relative aspect-[3.9] border-b">
          <Image
            alt={"Placeholder"}
            src={"/placeholder.jpg"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};


export const SkillView = ({skillId}:Props)=> {

    const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkillById(skillId),
  });

    const { isAuthenticated, user, isInitialized } = useAuth();
  
    const router = useRouter();


  return (
    <div className="relative flex w-full flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md px-10 ">
      <div className="relative h-64 overflow-hidden rounded-t-xl mb-4 flex items-center justify-center bg-gray-200">
        <img
          src="/headset.png"
          alt="Headset Image"
          className="w-full h-full object-contain rounded-t-xl"
        />
      </div>
      <div className="flex flex-row p-6 gap-4">
        <div className="flex-1">
          <h5 className="mb-2 flex justify-between font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            <span className="capitalize">{data.module}</span>
            <span>{data.charge_per_hour}€</span>
          </h5>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              <svg className="w-3 h-3 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {data.skill_category.name}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
              <svg className="w-3 h-3 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {data.department.name}
            </span>
          </div>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased text-justify mt-4">
       {data.description}
          </p>
        </div>
        {!isAuthenticated && !user && 
        <div className="flex-1 flex items-center justify-center">
              <button data-ripple-light="true" type="button" className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4"  onClick={()=>router.push("/sign-in")}>
     Log in to Contact Seller
          </button>
        </div>
        }
      </div>
    </div>
  );
}