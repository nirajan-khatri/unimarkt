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

const Page = () => {
  const [activeForm, setActiveForm] = useState<"job" | "skill" | "product">(
    "product"
  );

  return (
    <div className="max-w-7xl w-full mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>
            Create New{" "}
            {activeForm === "product"
              ? "Product"
              : activeForm === "job"
                ? "Job"
                : "Skill"}
          </CardTitle>
          <Select
            value={activeForm}
            onValueChange={(value: "job" | "skill" | "product") =>
              setActiveForm(value)
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
          {activeForm === "product" && <CreateProductForm />}
          {activeForm === "job" && <CreateProductForm />}
          {activeForm === "skill" && <CreateSkillForm />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
