import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";

const schema = z.object({
  query: z.string().max(120).optional()
});

type FormValues = z.infer<typeof schema>;

type FlightSearchFormProps = {
  defaultQuery?: string;
  onSearch: (query?: string) => void;
};

export const FlightSearchForm = ({
  defaultQuery,
  onSearch
}: FlightSearchFormProps) => {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { query: defaultQuery ?? "" }
  });

  const onSubmit = (values: FormValues) => {
    const normalized = values.query?.trim();
    onSearch(normalized || undefined);
  };

  return (
    <form
      className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input placeholder="Search by city, airline, or code" {...register("query")} />
      <Button type="submit" className="md:w-32">
        Search
      </Button>
    </form>
  );
};
