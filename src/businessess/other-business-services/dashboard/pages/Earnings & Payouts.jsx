//import { TriangleAlert } from "lucide-react"
import DriverBalances from "../../../business-transport/dashboard/components/earningComponents/DriverBalances"
import EarningTabs from "../../../business-transport/dashboard/components/earningComponents/EarningTabs"
import EarningsSummary from "../../../business-transport/dashboard/components/earningComponents/EarningsSummary"
import IncomeChart from "../../../business-transport/dashboard/components/earningComponents/IncomeChart"
import Reconciliation from "../../../business-transport/dashboard/components/earningComponents/Reconciliation"
import WalletCard from "../../../business-transport/dashboard/components/earningComponents/WalletCard"
import WalletLedger from "../../../business-transport/dashboard/components/earningComponents/WalletLedger"
//import { paymentWarning } from "../../../business-transport/dashboard/data/mockEarnings"
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout"

export default function Earnings() {
  return (
    <BeautyDashboardLayout>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <header className="mb-5 flex max-w-[719px] flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[#231F20]">
          Earnings &amp; Payouts
        </h1>
        <p className="text-sm leading-5 text-[#231F20BF]">
          The full money story — gross earnings in, the split, who&apos;s owed,
          payouts out, and the auditable ledger.
        </p>
      </header>

      <EarningsSummary />

      <section className="flex w-full flex-col items-stretch justify-center gap-5 lg:flex-row">
        <WalletCard />
        <IncomeChart />
      </section>

      <div className="my-5">
        <DriverBalances limit={1} />
      </div>

      <section className="my-5 flex w-full flex-col items-stretch justify-center gap-5 lg:flex-row">
        <Reconciliation />
        <EarningTabs />
      </section>

      <WalletLedger limit={1} />
      </main>
    </BeautyDashboardLayout>
  )
}
