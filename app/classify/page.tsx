import { AppShell, PageTitle } from "@/components/app-shell";
import { EmailClassifier } from "@/components/email-classifier";
export default function ClassifyPage(){return <AppShell><PageTitle eyebrow="Machine-learning classifier" title="Analyse a suspicious email" text="Paste only the subject and message body. The saved model runs after validation and records a short private excerpt in your history."/>
<EmailClassifier compact/></AppShell>}
