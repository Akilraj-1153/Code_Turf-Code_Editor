import React, { useRef, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { FaTerminal } from "react-icons/fa";
import {
  InputToServer,
  codeToServer,
  languageToServer,
  versionToServer,
} from "../Atoms/Atoms";
import { executeCode } from "../../API/api";

function Output() {
  const [servercode] = useRecoilState(codeToServer);
  const [serverlang] = useRecoilState(languageToServer);
  const [serverversion] = useRecoilState(versionToServer);
  const [output, setOutput] = useState(null);
  const [serverInput, setserverInput] = useRecoilState(InputToServer);

  const iframeRef = useRef(null);

  const handleServerCodeRun = async () => {
    try {
      const result = await executeCode(
        servercode,
        serverlang,
        serverversion,
        serverInput
      );
      const { output, stderr } = result.run;
      setOutput(stderr ? `Error: ${stderr}` : output);
      console.log(result);
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (output !== null) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const isError = output.toLowerCase().startsWith("error");

      iframeDoc.open();
      iframeDoc.write(`
        <style>
          body {
            font-size: 15px;
            margin: 0;
            padding: 0;
          }
          pre {
            font-size: 15px;
            padding: 5px;
            color: ${isError ? 'red' : 'black'};
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
        <pre>${output}</pre>
      `);
      iframeDoc.close();
    }
  }, [output]);

  return (
    <div className="flex flex-col gap-2 h-full overflow-scroll rounded-md">
      <div className="h-[6vh] w-full rounded-md flex items-center p-1 gap-2 bg-black text-white">
        <div className="flex justify-between items-center text-sm gap-3 w-full rounded-md">
          <button className="p-2 rounded-md">Output</button>
          <button
            className="p-2 rounded-md flex justify-center items-center gap-1 bg-white text-black"
            onClick={handleServerCodeRun}
          >
            <h1>Run</h1>
            <FaTerminal />
          </button>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        className="rounded-md flex flex-grow w-full h-full p-1 outline-none resize-none bg-white text-black"
        title="output-iframe"
      ></iframe>
    </div>
  );
}

export default Output;
