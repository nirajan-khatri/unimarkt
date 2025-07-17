"use client";

import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateProductForm from "@/modules/profile/ui/forms/create-product-form";
import CreateSkillForm from "@/modules/profile/ui/forms/create-skill-form";
import { parseAsStringEnum, useQueryState } from "nuqs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CreateJobForm from "@/modules/profile/ui/forms/create-job-form";
import { useAuth } from "@/modules/auth/contexts/authContext";

const Page = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const [type, setType] = useQueryState<"job" | "skill" | "product">(
    "type",
    parseAsStringEnum(["job", "skill", "product"]).withDefault("product")
  );

  console.log(hasRole("faculty"));

  return (
    <div className="max-w-7xl w-full mx-auto p-6">
      <Card className="border-border">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>
            <div className="flex flex-row gap-3 items-center">
              <Link href="/profile" passHref>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              Create New{" "}
              {type === "product"
                ? "Product"
                : type === "job"
                  ? "Job"
                  : "Skill"}
            </div>
          </CardTitle>
          <Select
            value={type}
            onValueChange={(value: "job" | "skill" | "product") =>
              setType(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-border">
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="skill">Skill</SelectItem>
              {!hasRole("user") && <SelectItem value="job">Job</SelectItem>}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {type === "product" && <CreateProductForm />}
          {type === "job" && <CreateJobForm />}
          {type === "skill" && <CreateSkillForm />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
