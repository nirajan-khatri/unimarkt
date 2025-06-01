"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Status } from "@/modules/products/types";
import { toast } from "sonner";
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
