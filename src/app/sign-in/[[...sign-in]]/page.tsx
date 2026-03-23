import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Valens Intelligence
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-gray-900 border border-gray-800 shadow-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton:
                'bg-gray-800 border-gray-700 text-white hover:bg-gray-700',
              formFieldLabel: 'text-gray-300',
              formFieldInput:
                'bg-gray-800 border-gray-700 text-white placeholder-gray-500',
              footerActionLink: 'text-amber-400 hover:text-amber-300',
              formButtonPrimary:
                'bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold',
              identityPreview: 'bg-gray-800 border-gray-700',
              identityPreviewText: 'text-gray-300',
              identityPreviewEditButton: 'text-amber-400',
            },
          }}
        />
      </div>
    </div>
  );
}
