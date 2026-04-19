import UsernameSetupModal from '@/src/app/components/username-setup-modal'

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UsernameSetupModal />
      {children}
    </>
  )
}
