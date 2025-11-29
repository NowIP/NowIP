<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

const isSignupEnabled = useRuntimeConfig().public.isSignupEnabled;

definePageMeta({
    layout: 'auth',
    title: 'Login | NowIP',
    meta: [
        { name: 'description', content: 'Login to your account' }
    ]
});

const route = useRoute()
const redirectUrl = route.query.url || '/';

const toast = useToast();

const fields: AuthFormField[] = [{
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
    required: true
}, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
}, {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox',
    description: 'You will stay logged in for 30 days.',
}]

const schema = z.object({
    username: z.string('Username is required'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    remember: z.boolean().optional()
});

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {

    const result = await useAPI().postAuthLogin({ body: payload.data });
    
    if (result.success) {
        
        updateAPIClient(result.data.token);

        const sessionToken = useCookie('session_token', {
            path:     '/',
            secure:   true,
            sameSite: 'lax',
            httpOnly: false,
            maxAge: payload.data.remember ? 60 * 60 * 24 * 30 : undefined // 30 days
        });

        sessionToken.value = result.data.token;

        await SessionStore.fetchAndSetUserInfo();

        toast.add({
            title: 'Login Successful',
            description: 'You have been logged in successfully.'
        });
        
        await navigateTo(redirectUrl.toString());
        return;

    } else {
        toast.add({
            title: 'Login Failed',
            description: 'An error occurred during login.'
        });
    }
}

</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm :schema="schema" title="Login" description="Enter your credentials to access your account."
                icon="i-lucide-user" :fields="fields" @submit="onSubmit" 
                :submit="{
                    label: 'Login',
                }"
            >
                <template #footer>
                    <div class="text-center text-sm">
                        <NuxtLink to="/auth/forgot-password" class="text-primary-600 hover:underline">
                            Forgot your password?
                        </NuxtLink>
                    </div>
                    <div v-if="isSignupEnabled" class="text-center text-sm mt-2">
                        Don't have an account?
                        <NuxtLink to="/auth/signup" class="text-primary-600 hover:underline">
                            Sign up
                        </NuxtLink>
                    </div>
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>
