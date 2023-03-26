import { IApiResponse } from "@/types/Api";
import { ContractID } from "@/types/Contracts";
import { decryptSecret } from "@/utils/locks";
import {
  contractQuery,
  contractTx,
  unwrapResultOrDefault,
  useInkathon,
  useRegisteredContract,
} from "@scio-labs/use-inkathon";
import axios from "axios";
import { useCallback } from "react";
import { toast } from "react-hot-toast";

const useApi = () => {
  const { activeAccount, api, activeSigner } = useInkathon();
  const { contract } = useRegisteredContract(ContractID.Vetra);
  const updateSession = async (
    address: string,
    email: string,
    phone: string
  ) => {
    const res = await axios.post<IApiResponse>("/api/account/auth", {
      address,
      email,
      phone,
    });

    return res.data;
  };

  const getEncryptedSecret = useCallback(async () => {
    const response = await axios.get<IApiResponse>(
      `/api/account/generate-secret`
    );
    return response.data;
  }, []);

  const generateEncryptedSecret = useCallback(async () => {
    if (!activeAccount || !activeSigner || !api || !contract) {
      toast.error("Please connect your wallet");
      return;
    }
    if (activeAccount && activeSigner && api && contract) {
      const response = await axios.post<IApiResponse>(
        `/api/account/generate-secret`
      );
      try {
        let res_info = response.data;
        if (res_info.status === "ok") {
          const encryptedNounce = res_info.data.encryptedNounce;

          if (encryptedNounce) {
            // save encrypted nounce onchain
            api.setSigner(activeSigner);
            await contractTx(
              api,
              activeAccount.address,
              contract,
              "addNounce",
              {},
              [encryptedNounce],
              (result) => {
                if (result.status.isInBlock) {
                  toast.success("Secret generated successfully");
                  console.log(result.events);
                }
              }
            );
          } else {
            toast.error("Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      }
    }
  }, [activeAccount]);

  const getEncryptedNounce = useCallback(async () => {
    if (!activeAccount || !activeSigner || !api || !contract) {
      // toast.error("Please connect your wallet");
      return null;
    }
    if (activeAccount && activeSigner && api && contract) {
      try {
        const result = await contractQuery(
          api,
          activeAccount.address,
          contract,
          "getNounce",
          {}
        );
        const encryptedNounce = unwrapResultOrDefault(result, "" as string);
        return encryptedNounce;
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
        return null;
      }
    }
  }, []);

  const getUserSecret = useCallback(async () => {
    try {
      const encryptedNounce = await getEncryptedNounce();
      const resp = await getEncryptedSecret();
      console.log(resp)
      console.log(encryptedNounce)
      if (resp.status === "ok") {
        const encryptedSecret = resp.data.encryptedSecret;
        if (encryptedSecret && encryptedNounce) {
          const secret = await decryptSecret(
            encryptedSecret,
            encryptedNounce,
            activeAccount.address
          );
          
          return secret;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
      return null;
    }
  }, [activeAccount]);

  return {
    updateSession,
    generateEncryptedSecret,
    getUserSecret,
  };
};

export default useApi;