import { Button } from "@/components/ui/button";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <>
      {/* <main className="font-sans text-gray-800 bg-[#FFFCEF] ">
        <section className="relative flex flex-col md:flex-row items-start justify-between py-12 md:py-20 mx-[10%] h-[90vh]">
          <div className="md:w-1/2 space-y-8 md:my-auto">
            <h1 className="text-4xl md:text-[6vw] font-semibold leading-tight">
              Collaborate, Innovate, Create
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Transform ideas into startups with expert guidance, collaboration,
              funding, and AI-powered validation.
            </p>

            <Link to={"/home"} className="hover:cursor-pointer">
              <Button className="!px-10 py-7 bg-yellow-400 text-black hover:bg-yellow-500">
                Get Started <ChevronRight />
              </Button>
            </Link>

            <div className="flex h-auto w-auto gap-4 mt-12 ">
              <img
                src="/illustrations/teamWorkIllustration.webp"
                className="h-20 md:h-32 rounded-xl"
                alt=""
              />
              <div className=" max-w-sm">
                <h2 className="text-lg font-semibold mb-2">Integration</h2>
                <p className="text-sm text-gray-600">
                  Our team will help you choose the type of connection and
                  select the payment functionality that meets your current
                  needs.
                </p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 relative mt-10 md:mt-0 flex-1 md:h-full w-full">
            <div className="absolute top-0 bottom-0 !left-18 md:left-12 w-[1px] bg-yellow-500" />

            <div className="absolute top-[24%] left-6 md:left-12 w-40 h-40 rounded-lg overflow-hidden border border-yellow-500 bg-gray-200 shadow-lg">
              <img src="/illustrations/collab.png" />
            </div>

            <div className="absolute top-[15%] left-0 md:left-[35%] w-20 h-20 bg-black text-white rounded-full shadow-md flex flex-col items-center justify-center">
              <ArrowRight className="rotate-45 size-10" />
            </div>

            <div className="absolute top-[10%] right-0 md:right-6 bg-white p-4 w-44 shadow-md rounded-md">
              <h3 className="text-sm text-gray-500">Total contributions</h3>
              <p className="text-2xl font-bold">1,292,571</p>
            </div>
            <div className="absolute top-[35%] right-[10%] flex items-center justify-center size-[40%] ">
              <video
                className="rounded-lg w-full h-full max-w-3xl max-h-full object-cover shadow-lg"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/codingVideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="absolute bottom-0 right-6 md:right-12 w-40 bg-white p-3 rounded-md shadow-md ">
              <h3 className="text-2xl font-bold">20k</h3>
              <p className="text-sm text-gray-500">
                Businesses have
                <br />
                already joined us!
              </p>
            </div>
            <div className="absolute bottom-[10%] left-0 w-40 text-right">
              <p className="text-sm text-gray-500">Build your network</p>
              <p className="font-bold text-lg leading-tight">
                Get new friends
                <br />
                be in touch
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h1 className="font-bold text-xl mb-2">For Students</h1>
            <p className="text-gray-600">
              Validate your startup ideas with AI, connect with mentors, find
              co-founders, and secure funding to bring your vision to life.
            </p>
          </div>
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h1 className="font-bold text-xl mb-2">For Mentors</h1>
            <p className="text-gray-600">
              Guide aspiring entrepreneurs, review innovative ideas, and help
              shape the next generation of successful startups.
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 pb-12">
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main> */}
      <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
        <section className="text-center ">
          <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl tracking-tighter py-4">
            Make your Imagination
            <span className="flex items-center gap-2 sm:gap-6">a Reality</span>
          </h1>
          <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
            Transform ideas into startups with expert guidance, collaboration,
            funding, and AI-powered validation.
          </p>
        </section>
        <div className="flex gap-6 justify-center">
          <Link to={"/home"}>
            <Button variant="blue" size="xl">
              Get Started
            </Button>
          </Link>
        </div>

        <img src="/banner.png" className="h-half" />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">For Students</CardTitle>
            </CardHeader>
            <CardContent>
              Validate your startup ideas with AI, connect with mentors, find
              co-founders, and secure funding to bring your vision to life.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">For Mentors</CardTitle>
            </CardHeader>
            <CardContent>
              Guide aspiring entrepreneurs, review innovative ideas, and help
              shape the next generation of successful startups.
            </CardContent>
          </Card>
        </section>

        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
};

export default LandingPage;
