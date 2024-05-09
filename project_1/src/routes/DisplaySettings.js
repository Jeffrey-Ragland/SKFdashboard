import React, { useState } from 'react'
import DisplayNavbar from '../components/dashboard/DisplayNavbar';
import DisplaySidebar from '../components/dashboard/DisplaySidebar';
import xymaimg from "./xyma.png";
import {
  FiUser,
  FiFile,
  FiBookOpen,
  FiHelpCircle
} from "react-icons/fi";
import { FaBuildingUser } from "react-icons/fa6";
import { MdAttachEmail } from "react-icons/md";
import { GiOrganigram } from "react-icons/gi";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaSearchLocation } from "react-icons/fa";
import { AiOutlineBook, AiOutlinePrinter } from "react-icons/ai";
import { MdInsertChartOutlined } from "react-icons/md";

const DisplaySettings = () => {

    const [selectedUI, setSelectedUI] = useState('personalInfo');
    const projectName = localStorage.getItem("Project");

    const handleUI = (UI) =>
    {
        setSelectedUI(UI);
    };

    const renderUI = () =>
    {
        switch (selectedUI) {
          // personal information 
          case "personalInfo":
            return (
              <div className="h-full bg-white rounded-md shadow-xl">
                {/* title */}
                <div className="bg-gray-500 h-[8%] rounded-t-md flex text-white">
                  <div className="w-[90%] flex items-center ml-1">
                    Personal Information
                  </div>
                  <div className="w-[10%] flex items-center justify-center bg-amber-400 rounded-tr-md">
                    <FiUser size={18} />
                  </div>
                </div>
                {/* content */}
                <div className="h-[92%] p-4">
                  {/* image */}
                  <div className="h-[20%] flex items-center justify-center">
                    <img
                      className="h-12 w-18 hover:scale-110 duration-200 cursor-pointer"
                      onClick={() => {
                        window.open("https://www.xyma.in", "_blank");
                      }}
                      src={xymaimg}
                      alt="/"
                    />
                  </div>
                  {/* info */}
                  <div
                    className="h-[80%] font-light text-xl sm:text-2xl flex flex-col gap-4 overflow-auto"
                    style={{ scrollbarWidth: "none" }}
                  >
                    <div className="flex h-1/4">
                      <div className="flex w-1/2 h-full">
                        <div className="flex items-center justify-center ml-[50%]">
                          <FaBuildingUser size={30} />
                        </div>
                        <div className="flex items-center">Name</div>
                      </div>
                      <div className="w-1/2 flex items-center">
                        : Xyma Analytics
                      </div>
                    </div>

                    <div className="flex w-full justify-center">
                      <div className="border border-amber-400 w-[50%]"></div>
                    </div>

                    <div className="flex h-1/4">
                      <div className="flex w-1/2 h-full">
                        <div className="flex items-center justify-center ml-[50%]">
                          <MdAttachEmail size={30} />
                        </div>
                        <div className="flex items-center">Email</div>
                      </div>
                      <div className="w-1/2 flex items-center">
                        : info@xyma.in
                      </div>
                    </div>

                    <div className="flex w-full justify-center">
                      <div className="border border-amber-400 w-[50%]"></div>
                    </div>

                    <div className="flex h-1/4">
                      <div className="flex w-1/2 h-full">
                        <div className="flex items-center justify-center ml-[50%]">
                          <GiOrganigram size={30} />
                        </div>
                        <div className="flex items-center">Client</div>
                      </div>
                      <div className="w-1/2 flex items-center">
                        : {projectName}
                      </div>
                    </div>

                    <div className="flex w-full justify-center">
                      <div className="border border-amber-400 w-[50%]"></div>
                    </div>

                    <div className="flex h-1/4">
                      <div className="flex w-1/2 h-full">
                        <div className="flex items-center justify-center ml-[50%]">
                          <FaMobileScreenButton size={30} />
                        </div>
                        <div className="flex items-center">Contact</div>
                      </div>
                      <div className="w-1/2 flex items-center">
                        : 91-9442949347
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );

          case "assetInfo":
            return (
              <div className="h-full bg-white rounded-md shadow-lg">
                {/* title */}
                <div className="bg-gray-500 h-[8%] rounded-t-md flex text-white">
                  <div className="w-[90%] flex items-center ml-1">
                    Asset Information
                  </div>
                  <div className="w-[10%] flex items-center justify-center bg-amber-400 rounded-tr-md">
                    <FiFile size={18} />
                  </div>
                </div>
                {/* content */}
                <div className="h-[92%]">
                  {/* map */}
                  <div className="h-[87%] sm:h-[93%] p-2">
                    <iframe
                      title="xyma"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src="https://maps.google.com/maps?width=100%25&amp;height=230&amp;hl=en&amp;q=Xyma%20Analytics%20Pvt%20Ltd,%20+(Xyma)&amp;t=k&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    >
                      <a href="https://www.gps.ie/">gps devices</a>
                    </iframe>
                  </div>
                  {/* location */}
                  <div className="h-[13%] sm:h-[7%] flex rounded-b-md">
                    <div className="flex gap-1 items-center justify-center w-[30%] font-medium bg-amber-400 text-white rounded-bl-md">
                      <FaSearchLocation size={25} />
                      <div>Location</div>
                    </div>
                    <div className="flex items-center justify-center w-[70%] bg-gray-300 rounded-br-md">
                      <div
                        className="h-[80%] w-[90%] overflow-auto text-sm rounded-md bg-white"
                        style={{ scrollbarWidth: "none" }}
                      >
                        B4-01, 4th Floor, B Block, IITM RESEARCH PARK, Kanagam,
                        Tharamani, Chennai, Tamil Nadu 600113
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );

          case "documentation":
            return (
              <div className="h-full bg-white rounded-md">
                {/* title */}
                <div className="bg-gray-500 h-[8%] rounded-t-md flex text-white">
                  <div className="w-[90%] flex items-center ml-1">
                    Download Docuements
                  </div>
                  <div className="w-[10%] flex items-center justify-center bg-amber-400 rounded-tr-md">
                    <FiBookOpen size={18} />
                  </div>
                </div>
                {/* content */}
                <div className="h-[92%] flex flex-col gap-2 p-2 text-sm font-medium">
                  <div className="h-1/2 flex gap-2">
                    <div className="w-1/2 flex flex-col items-center justify-center bg-gray-200 rounded-md hover:scale-[1.03] duration-200 cursor-pointer">
                      <div>
                        <AiOutlineBook size={60} />
                      </div>
                      <div>User Manual</div>
                    </div>
                    <div className="w-1/2 flex flex-col items-center justify-center bg-gray-200 rounded-md hover:scale-[1.03] duration-200 cursor-pointer">
                      <div>
                        <MdInsertChartOutlined size={60} />
                      </div>
                      <div>schematic</div>
                    </div>
                  </div>
                  <div className="h-1/2 w-full flex flex-col items-center justify-center bg-gray-200 rounded-md hover:scale-[1.02] duration-200 cursor-pointer">
                    <div>
                      <AiOutlinePrinter size={60} />
                    </div>
                    <div>Document</div>
                  </div>
                </div>
              </div>
            );

          case "support":
            return (
              <div className="h-full bg-white rounded-md">
                {/* title */}
                <div className="bg-gray-500 h-[8%] rounded-t-md flex text-white">
                  <div className="w-[90%] flex items-center ml-1">
                    Customer Support
                  </div>
                  <div className="w-[10%] flex items-center justify-center bg-amber-400 rounded-tr-md">
                    <FiHelpCircle size={18} />
                  </div>
                </div>
                {/* content */}
                <div className="h-[92%]"></div>
              </div>
            );
        }
    }

  return (
    <>
      <div className="flex h-screen">
        {/* left side - sidebar */}
        <div>
          <DisplaySidebar />
        </div>

        {/* right side */}
        <div className="w-full">
          {/* navbar */}
          <div>
            <DisplayNavbar />
          </div>

          {/* main content */}
          <div className="h-[87%] p-2 sm:flex gap-2">
            {/* left/top side */}
            <div className="grid gap-2 grid-cols-2 h-1/2 sm:h-full sm:w-1/2 mb-2 text-sm font-medium">
              {/* first card */}
              <div
                className="flex flex-col items-center justify-center bg-white rounded-md cursor-pointer hover:scale-[1.03] duration-200 shadow-lg border border-amber-400"
                onClick={() => handleUI("personalInfo")}
              >
                <FiUser className="mb-2" size={60} />
                <div className="text-sm font-medium">Personal Info</div>
              </div>

              {/* second card */}
              <div
                className="flex flex-col items-center justify-center bg-white rounded-md cursor-pointer hover:scale-[1.03] duration-200 shadow-lg border border-amber-400"
                onClick={() => handleUI("assetInfo")}
              >
                <FiFile className="mb-2" size={60} />
                <div className="text-sm font-medium">Asset Info</div>
              </div>

              {/* third card */}
              <div
                className="flex flex-col items-center justify-center bg-white rounded-md cursor-pointer hover:scale-[1.03] duration-200 shadow-lg border border-amber-400"
                onClick={() => handleUI("documentation")}
              >
                <FiBookOpen className="mb-2" size={60} />
                <div className="text-sm font-medium">Documentation</div>
              </div>

              {/* fourth card */}
              <div
                className="flex flex-col items-center justify-center bg-white rounded-md cursor-pointer hover:scale-[1.03] duration-200 shadow-lg border border-amber-400"
                onClick={() => handleUI("support")}
              >
                <FiHelpCircle className="mb-2" size={60} />
                <div className="text-sm font-medium">Support</div>
              </div>
            </div>
            {/* right/bottom side */}
            <div className="rounded-md h-1/2 sm:h-full sm:w-1/2">
              {renderUI()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DisplaySettings
