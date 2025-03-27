"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface BalanceInfo {
  balanceType: string;
  amount: {
    value: string;
    currency: string;
  };
  floatAmount: {
    value: string;
    currency: string;
  };
  holdAmount: {
    value: string;
    currency: string;
  };
  availableBalance: {
    value: string;
    currency: string;
  };
  ledgerBalance: {
    value: string;
    currency: string;
  };
  currentMultilateralLimit: {
    value: string;
    currency: string;
  };
  registrationStatusCode: string;
  status: string;
}

interface AdditionalInfo {
  deviceId: string;
  channel: string;
}

interface ApiResponse {
  responseCode: string;
  responseMessage: string;
  referenceNo: string;
  partnerReferenceNo: string;
  accountNo: string;
  name: string;
  accountInfos: BalanceInfo[];
  additionalInfo: AdditionalInfo;
}

const DISPLAY_ACCOUNT = {
  amount: "Total Amount",
  floatAmount: "Floating Amount",
  holdAmount: "Held Amount",
  availableBalance: "Available Balance",
  ledgerBalance: "Ledger Balance",
  currentMultilateralLimit: "Multilateral Limit",
};
type KeyDisplay = keyof typeof DISPLAY_ACCOUNT;

const InformasiSaldo = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError(""); // Clear the error state before making a new API call
    try {
      const response = await axios.get(
        "http://127.0.0.1:8001/api-maybank-v1/balinfo"
      );
      console.log(response.data.data);
      setData(response.data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Safely access the error message
      } else {
        setError("An unknown error occurred"); // Handle non-Error objects
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white max-w-screen py-[80px] px-4">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-semibold text-center text-[#5569B2]">
            Restaurant Balance Information
          </h1>
          <div className="text-center mt-4 min-h-[100px] flex flex-col items-center justify-center">
            {!data && !error && (
              <>
                <div className="loader border-t-4 border-b-4 border-[#5569B2] rounded-full w-12 h-12 animate-spin"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </>
            )}
            {error && <div className="text-red-500">Error: {error}</div>}
            <button
              className="mt-4 bg-[#5569B2] text-white py-2 px-4 rounded hover:bg-[#3f4e8c]"
              onClick={fetchData}
            >
              Refresh Balance
            </button>
          </div>
        </div>

        {data && (
          <>
            <div className="text-lg font-medium text-center mt-2">
              <p>Restaurant Name: {data.name}</p>
            </div>
            <div className="text-lg font-medium text-center">
              <p>Account Number: {data.accountNo}</p>
            </div>
            <div className="text-lg font-medium text-center">
              <p>Reference Number: {data.partnerReferenceNo}</p>
            </div>

            <div className="border-b border-gray-300 pb-2 mt-4"></div>

            <div className="mt-3">
              {data.accountInfos.map((info, infoIndex) => (
                <div key={infoIndex} className="mb-6">
                  <h2 className="font-semibold text-[#5569B2]">
                    Balance Type: {info.balanceType}
                  </h2>
                  <h2 className="font-semibold text-[#5569B2]">
                    Status: {info.status}
                  </h2>
                  <h2 className="font-semibold text-[#5569B2]">
                    Registration Status Code: {info.registrationStatusCode}
                  </h2>
                  <table className="w-full mt-2 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-[#5569B2] text-white">
                        <th className="border border-gray-300 px-4 py-2">#</th>
                        <th className="border border-gray-300 px-4 py-2">
                          Description
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Value
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                          Currency
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(info)
                        .filter(
                          ([key]) =>
                            ![
                              "balanceType",
                              "registrationStatusCode",
                              "status",
                            ].includes(key)
                        )
                        .map(([key, data], index) => (
                          <tr
                            key={index}
                            className="text-left odd:bg-white even:bg-gray-100"
                          >
                            <td className="border border-gray-300 px-4 py-2">
                              {index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {DISPLAY_ACCOUNT[key as KeyDisplay]}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {(data as { value: string }).value}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {(data as { currency: string }).currency}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InformasiSaldo;
