"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import ProfileDetailsCard from "../components/profile-details-card";
import { useUser } from "../../hooks/useUser";
import { redirect } from "next/navigation";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { ProfileServiceGrid } from "../components/profile-skill-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileProductGrid } from "../components/profile-product-grid";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUserProducts } from "../../api";
import { fetchUserSkills } from "../../api";
import {
  ProductGridSkeleton,
  SkillGridSkeleton,
} from "../components/skeletons";
import { Pagination } from "@/components/ui/pagination";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Shield } from "lucide-react";
import SecuritySection from "../components/SecuritySection";
import { useRouter } from "next/navigation";
import { useUserJobs } from "@/modules/jobs/hooks/useJobs";
import { ProfileJobGrid } from "../components/profile-job-grid";

// Products Component wrapped in Suspense
const ProductsSection = ({ userId }: { userId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isArchivedFilter, setIsArchivedFilter] = useState<boolean | undefined>(undefined);

  const { data: userProductsResponse } = useSuspenseQuery({
    queryKey: ["userProducts", userId, currentPage, pageSize, statusFilter, isArchivedFilter],
    queryFn: () => fetchUserProducts(userId, currentPage, pageSize, statusFilter === "all" ? undefined : statusFilter, isArchivedFilter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleArchivedFilterChange = (archived: boolean | undefined) => {
    setIsArchivedFilter(archived);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const showPagination = userProductsResponse && userProductsResponse.count > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={statusFilter === "all" && isArchivedFilter === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setIsArchivedFilter(undefined);
          }}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("pending");
            setIsArchivedFilter(false);
          }}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("approved");
            setIsArchivedFilter(false);
          }}
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === "rejected" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("rejected");
            setIsArchivedFilter(false);
          }}
        >
          Rejected
        </Button>
        <Button
          variant={isArchivedFilter === true ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setIsArchivedFilter(true);
          }}
        >
          Archived
        </Button>
      </div>

      <ProfileProductGrid
        products={userProductsResponse.results}
        error=""
        isLoading={false}
      />

      {showPagination && (
        <Pagination
          currentPage={userProductsResponse.currentPage}
          totalItems={userProductsResponse.count}
          pageSize={pageSize}
          hasNext={userProductsResponse.hasNext}
          hasPrevious={userProductsResponse.hasPrevious}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

// Skills Component wrapped in Suspense
const SkillsSection = ({ userId }: { userId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isArchivedFilter, setIsArchivedFilter] = useState<boolean | undefined>(undefined);

  const { data: userSkillsResponse } = useSuspenseQuery({
    queryKey: ["userSkills", userId, currentPage, pageSize, statusFilter, isArchivedFilter],
    queryFn: () => fetchUserSkills(userId, currentPage, pageSize, statusFilter === "all" ? undefined : statusFilter, isArchivedFilter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleArchivedFilterChange = (archived: boolean | undefined) => {
    setIsArchivedFilter(archived);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const showPagination = userSkillsResponse && userSkillsResponse.count > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={statusFilter === "all" && isArchivedFilter === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setIsArchivedFilter(undefined);
          }}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("pending");
            setIsArchivedFilter(false);
          }}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("approved");
            setIsArchivedFilter(false);
          }}
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === "rejected" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("rejected");
            setIsArchivedFilter(false);
          }}
        >
          Rejected
        </Button>
        <Button
          variant={isArchivedFilter === true ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setIsArchivedFilter(true);
          }}
        >
          Archived
        </Button>
      </div>

      <ProfileServiceGrid
        services={userSkillsResponse.results}
        error={null}
        isLoading={false}
      />

      {showPagination && (
        <Pagination
          currentPage={userSkillsResponse.currentPage}
          totalItems={userSkillsResponse.count}
          pageSize={pageSize}
          hasNext={userSkillsResponse.hasNext}
          hasPrevious={userSkillsResponse.hasPrevious}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

// Jobs Component wrapped in Suspense
const JobsSection = ({ userId }: { userId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isArchivedFilter, setIsArchivedFilter] = useState<boolean | undefined>(undefined);

  const { data: userJobsResponse, isLoading, error } = useUserJobs(
    userId,
    currentPage,
    pageSize,
    undefined, // ordering
    statusFilter === "all" ? undefined : statusFilter,
    isArchivedFilter
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleArchivedFilterChange = (archived: boolean | undefined) => {
    setIsArchivedFilter(archived);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const showPagination = userJobsResponse && userJobsResponse.count > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={statusFilter === "all" && isArchivedFilter === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setIsArchivedFilter(undefined);
          }}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("pending");
            setIsArchivedFilter(false);
          }}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("approved");
            setIsArchivedFilter(false);
          }}
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === "rejected" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("rejected");
            setIsArchivedFilter(false);
          }}
        >
          Rejected
        </Button>
        <Button
          variant={isArchivedFilter === true ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setStatusFilter("all");
            setIsArchivedFilter(true);
          }}
        >
          Archived
        </Button>
      </div>

      <ProfileJobGrid
        jobs={userJobsResponse?.results || []}
        error={error as Error | null}
        isLoading={isLoading}
      />

      {showPagination && (
        <Pagination
          currentPage={userJobsResponse.currentPage}
          totalItems={userJobsResponse.count}
          pageSize={pageSize}
          hasNext={userJobsResponse.hasNext}
          hasPrevious={userJobsResponse.hasPrevious}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

const ProfileView = () => {
  const { user, isInitialized, isAuthenticated } = useAuth();
  const { user: userDetails, isLoading } = useUser(user?.id.toString() ?? "");
  const [tab, setTab] = useQueryState<"jobs" | "services" | "products">(
    "tab",
    parseAsStringEnum(["products", "services", "jobs"]).withDefault("products")
  );
  const router = useRouter();

  // if (userLoading || detailsLoading) {
  //   return (
  //     <div className="px-4 lg:px-12 py-10">
  //       <div className="animate-pulse">
  //         <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
  //         <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
  //       </div>
  //     </div>
  //   );
  // }

  if (isInitialized && !isAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <div className="px-4 lg:px-12 py-10 flex flex-col gap-y-8">
      {user && (
        <>
          <ProfileDetailsCard
            id={user.id}
            name={user.name}
            email={user.email}
            contact_number={user.contact_number || undefined}
            role={user.role || "User"}
            loading={isLoading}
          />
          <div className="flex flex-col gap-4 mb-2">
            <SecuritySection
              is2FAEnabled={user.two_factor_enabled}
              onEnable2FA={() => router.push("/profile/2fa")}
              onManage2FA={() => router.push("/profile/2fa")}
            />
          </div>
        </>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3">
          <p className="text-2xl">Your Listings</p>
          <div className="flex flex-row gap-3">
            <Button
              variant="outline"
              className="border-primary text-primary"
              asChild
            >
              <Link href={"profile/sold"}>Show Sold Listings</Link>
            </Button>
            <Button asChild>
              <Link href={"profile/create"}>Create a new Listing</Link>
            </Button>
          </div>
        </div>
        <Tabs
          defaultValue="products"
          value={tab}
          onValueChange={(value) =>
            setTab(value as "products" | "services" | "jobs")
          }
        >
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            {user?.role !== "user" && (
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="products">
            {user?.id && (
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductsSection userId={user.id.toString()} />
              </Suspense>
            )}
          </TabsContent>
          <TabsContent value="services">
            {user?.id && (
              <Suspense fallback={<SkillGridSkeleton />}>
                <SkillsSection userId={user.id.toString()} />
              </Suspense>
            )}
          </TabsContent>
          <TabsContent value="jobs">
            {user?.id && (
              <Suspense fallback={<SkillGridSkeleton />}>
                <JobsSection userId={user.id.toString()} />
              </Suspense>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileView;
