import UsernameSetupModal from '@/src/app/components/username-setup-modal'

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UsernameSetupModal />
      {children}
    </>
  )
}
