import React, { useState } from "react";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { ExternalLink } from "react-external-link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import Plunk from '@plunk/node';
import { render } from '@react-email/render';
import Email from './Email';

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const sendEmail = async (data) => {
    setIsSubmitting(true);
    const plunk = new Plunk("sk_1d1ceb4d3c639c25a50614bab15836d1d4285ff299e89e52");

    const formData = new FormData();
    formData.append("user_name", data.user_name);
    formData.append("user_email", data.user_email);
    formData.append("message", data.message);
    if (data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      const emailHtml = render(<Email senderName={data.user_name} senderEmail={data.user_email} message={data.message} image={data.image[0]} />);
      
      const emailData = {
        to: "akillearn01@gmail.com",
        subject: `Message from ${data.user_name}`,
        body: emailHtml,
      };

      if (data.image[0]) {
        emailData.attachments = [
          {
            filename: data.image[0].name,
            content: await data.image[0].arrayBuffer(),
            encoding: 'base64',
          },
        ];
      }

      await plunk.emails.send(emailData);

      toast.success("Email sent successfully!");
    } catch (error) {
      toast.error("Failed to send email.");
      console.error("Email sending error: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="xs:px-2 md:px-5 lg:px-10 font-mono h-full w-full">
      <div className="bg-white h-full w-full justify-center items-center flex flex-col">
        <div className="contacttext p-3">
          <h2 className="text-2xl font-mateSc font-bold">Contact me in</h2>
        </div>
        <div className="flex flex-row gap-10 p-2">
          <button className="contacticon">
            <ExternalLink href="https://www.linkedin.com/in/akilrajn1153">
              <FaLinkedinIn size={35} className="icon" />
            </ExternalLink>
          </button>
          <button className="contacticon">
            <ExternalLink href="https://github.com/Akilraj-1153">
              <FaGithub size={35} className="icon"></FaGithub>
            </ExternalLink>
          </button>
          <button className="contacticon">
            <ExternalLink href="https://instagram.com/iam_akil_20?igshid=YTQwZjQ0NmI0OA==">
              <RiInstagramFill size={35} className="icon"></RiInstagramFill>
            </ExternalLink>
          </button>
          <button className="contacticon">
            <ExternalLink href="https://x.com/Akilraj1153?t=nclAtn7CQGL7vEhqIDB3pA&s=08">
              <FaTwitter size={35} className="icon"></FaTwitter>
            </ExternalLink>
          </button>
        </div>

        <div className="form xs:w-[90%] md:w-[70%] lg:w-[50%] p-5 m-5 rounded-xl bg-black text-white">
          <form onSubmit={handleSubmit(sendEmail)} className="flex flex-col gap-2">
            <label className="namelabel">Name</label>
            <input
              className="p-2 nameip rounded-lg h-10 text-black font-sans outline-none"
              type="text"
              {...register("user_name")}
            />

            <label className="emaillabel">Email</label>
            <input
              className="p-2 emailip rounded-lg h-10 font-sans text-black outline-none"
              type="email"
              {...register("user_email", { required: true })}
            />
            {errors.user_email && <span className="error">Email is required</span>}

            <label className="textlabel">Message</label>
            <textarea
              className="p-2 textip rounded-lg font-sans h-20 text-black outline-none"
              {...register("message", { required: true })}
            ></textarea>
            {errors.message && <span className="error">Message is required</span>}

            <label className="filelabel">Attach an Image</label>
            <input type="file" {...register("image")} />

            <input
              className="p-2 submitbtn rounded-lg h-10 bg-blue-500 mt-4 outline-none"
              type="submit"
              value="Send"
              disabled={isSubmitting}
            />
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ContactPage;