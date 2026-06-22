import { api } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { Loading } from "@/components/loading";
import { TestimonialsManager } from "@/components/admin-testimonials";
import type { Testimonial } from "@/lib/data";

export default function AdminTestimonials() {
  const { data, loading } = useApiData(() =>
    api.get("/api/testimonials").then((t) => t as Testimonial[]),
  );

  if (loading || !data) return <Loading />;
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Testimonials</h1>
        <p className="adm__subtitle">Insert, update, or delete testimonials</p>
      </div>
      <TestimonialsManager testimonials={data} />
    </div>
  );
}
