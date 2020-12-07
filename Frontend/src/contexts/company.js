import React, { createContext, useState } from "react";

const CompanyContext = createContext({
  state: { company: "삼성전자" },
  actions: {
    setCompany: () => {},
  },
});

const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState("삼성전자");

  const value = {
    state: { company },
    actions: { setCompany },
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export { CompanyProvider };

export default CompanyContext;
