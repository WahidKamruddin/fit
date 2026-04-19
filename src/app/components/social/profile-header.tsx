import { Avatar, AvatarFallback, AvatarImage } from '@/src/app/components/ui/avatar'
import FollowButton from './follow-button'
import type { ProfileView } from '@/src/app/types/social'

interface Props {
  profile: ProfileView
  isOwnProfile: boolean
  onEditProfile?: () => void
}

export default function ProfileHeader({ profile, isOwnProfile, onEditProfile }: Props) {
  const initials = (profile?.display_name ?? profile?.username ?? '?')
    .split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <Avatar className="h-20 w-20 ring-1 ring-mocha-200 flex-shrink-0">
        <AvatarImage src={profile.avatar_url ?? ''} alt={profile.display_name ?? ''} />
        <AvatarFallback className="bg-mocha-200 text-mocha-500 text-xl font-semibold">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <h2 className="font-cormorant text-3xl font-light text-mocha-500 leading-none">
            {profile.display_name ?? profile.username}
          </h2>
          {isOwnProfile ? (
            <button
              onClick={onEditProfile}
              className="px-4 py-1.5 border border-mocha-200 text-mocha-400 text-[9px] tracking-[0.3em] uppercase rounded-full hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
            >
              Edit
            </button>
          ) : (
            <FollowButton targetId={profile.id} initialIsFollowing={profile.is_following} />
          )}
        </div>

        <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-300 mb-2">
          @{profile.username}
        </p>

        {profile.bio && (
          <p className="text-sm text-mocha-400 leading-relaxed mb-3 max-w-sm">{profile.bio}</p>
        )}

        <div className="flex gap-5">
          {[
            { label: 'Posts',     value: profile.posts_count },
            { label: 'Followers', value: profile.followers_count },
            { label: 'Following', value: profile.following_count },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-cormorant text-2xl font-light text-mocha-500 leading-none">{value}</p>
              <p className="text-[9px] tracking-[0.35em] uppercase text-mocha-300 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
