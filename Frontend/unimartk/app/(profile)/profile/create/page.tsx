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

const Page = () => {
  const [type, setType] = useQueryState<"job" | "skill" | "product">(
    "type",
    parseAsStringEnum(["job", "skill", "product"]).withDefault("product")
  );

  return (
    <div className="max-w-7xl w-full mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>
            Create New{" "}
            {type === "product" ? "Product" : type === "job" ? "Job" : "Skill"}
          </CardTitle>
          <Select
            value={type}
            onValueChange={(value: "job" | "skill" | "product") =>
              setType(value)
            }
          >
            <SelectTrigger className="w-40 text-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="skill">Skill</SelectItem>
              <SelectItem value="job">Job</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {type === "product" && <CreateProductForm />}
          {type === "job" && <CreateProductForm />}
          {type === "skill" && <CreateSkillForm />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
