import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
// import { getJobs } from "@/lib/api";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
export default function HomePage() {
  const { user } = useAuth();

  // const jobs = getJobs();

  return (
    <>
      <h1>Hello {user}</h1>

      {/* <p>{jobs[0]}</p> */}
      <div className="flex gap-1.5">
        <Button className="px-4 py-4 text-lg">
          Look here
        </Button>
        <div className="p-6">
          <Input placeholder="Enter your name" />
        </div>
        <Card >
        <h2 className="text-lg font-semibold">Hello Card</h2>
        <p className="text-sm text-slate-500">
          This is reusable card component
        </p>
      </Card>
      
      </div>
    </>
  );
}