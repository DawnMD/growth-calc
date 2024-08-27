// import Link from "next/link";
// import { api, HydrateClient } from "@/trpc/server";

// export default async function Home() {
//   const hello = await api.post.hello({ text: "from tRPC" });

//   return (
//     <HydrateClient>
//       <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
//         <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
//           <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
//             Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
//           </h1>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
//               href="https://create.t3.gg/en/usage/first-steps"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">First Steps →</h3>
//               <div className="text-lg">
//                 Just the basics - Everything you need to know to set up your
//                 database and authentication.
//               </div>
//             </Link>
//             <Link
//               className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
//               href="https://create.t3.gg/en/introduction"
//               target="_blank"
//             >
//               <h3 className="text-2xl font-bold">Documentation →</h3>
//               <div className="text-lg">
//                 Learn more about Create T3 App, the libraries it uses, and how
//                 to deploy it.
//               </div>
//             </Link>
//           </div>
//           <div className="flex flex-col items-center gap-2">
//             <p className="text-2xl text-white">
//               {hello ? hello.greeting : "Loading tRPC query..."}
//             </p>
//           </div>
//         </div>
//       </main>
//     </HydrateClient>
//   );
// }
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { childData } from "data/childData";
import { GrowthWeightChart } from "@/components/GrowthWeightChart";
import { useState } from "react";

const formSchema = z.object({
  age: z.number().int().min(0).max(96),
  height: z.number().int(),
  weight: z.number(),
  gender: z.union([z.literal("boy"), z.literal("girl")]),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
      height: 0,
      weight: 0,
      gender: undefined,
    },
  });

  const [heightStatus, setHeightStatus] = useState<string>("");
  const [weightStatus, setWeightStatus] = useState<string>("");

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = childData[values.gender];
    const reference = data.find((d) => d.age_in_months === values.age);

    if (!reference) {
      console.log({ error: "Reference data not found for the given age." });
    }

    const refWeight = reference!.weight_kg;
    const refHeight = reference!.height_cm;

    // Determine weight status
    let weightStatus;
    if (values.weight < 0.74 * refWeight) {
      weightStatus = "Underweight";
    } else if (values.weight > 1.24 * refWeight) {
      weightStatus = "Overweight";
    } else {
      weightStatus = "Normal weight";
    }

    // Determine height status
    let heightStatus;
    if (values.height < 0.94 * refHeight) {
      heightStatus = "Stunted height";
    } else if (values.height > 1.06 * refHeight) {
      heightStatus = "Tall height";
    } else {
      heightStatus = "Normal height";
    }

    setHeightStatus(heightStatus);
    setWeightStatus(weightStatus);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="boy">Boy</SelectItem>
                    <SelectItem value="girl">Girl</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={() => (
              <FormItem>
                <FormLabel>Age (months)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12"
                    {...form.register("age", { valueAsNumber: true })}
                    type="number"
                    step={"1"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="height"
            render={() => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12"
                    {...form.register("height", { valueAsNumber: true })}
                    type="number"
                    step={"1"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={() => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12"
                    {...form.register("weight", { valueAsNumber: true })}
                    type="number"
                    step={"0.1"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {form.formState.isSubmitSuccessful && (
        <GrowthWeightChart
          age={form.getValues("age")}
          height={form.getValues("height")}
          weight={form.getValues("weight")}
          heightStatus={heightStatus}
          weightStatus={weightStatus}
        />
      )}
    </>
  );
}
