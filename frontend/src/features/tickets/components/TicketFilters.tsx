import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { TicketFilters } from "../api";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";

const schema = z.object({
  flightId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

type TicketFiltersProps = {
  defaultValues?: TicketFilters;
  onApply: (filters: TicketFilters) => void;
};

export const TicketFilters = ({
  defaultValues,
  onApply
}: TicketFiltersProps) => {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const onSubmit = (values: FormValues) => {
    onApply({
      flightId: values.flightId?.trim() || undefined,
      from: values.from || undefined,
      to: values.to || undefined
    });
  };

  return (
    <form
      className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input placeholder="Flight ID" {...register("flightId")} />
      <Input type="date" {...register("from")} />
      <Input type="date" {...register("to")} />
      <Button type="submit">Apply filters</Button>
    </form>
  );
};
