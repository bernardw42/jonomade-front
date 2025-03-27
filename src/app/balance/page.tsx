import Head from "next/head";
import TableSec from "../../components/Table/tableSec";
import Header from "@/components/Table/Header";

export default function table() {
  return (
    <div>
      <Header></Header>
      <TableSec />
    </div>
  );
}
