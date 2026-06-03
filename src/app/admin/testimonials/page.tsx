import { getTestimonials } from "@/lib/store";
import { TestimonialsManager } from "@/components/admin-testimonials";

export default async function AdminTestimonials() {
  const testimonials = await getTestimonials();
  return (
    <div>
      <div className="adm__header">
        <h1 className="adm__title">Testimonials</h1>
        <p className="adm__subtitle">Insert, update, or delete testimonials</p>
      </div>
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
