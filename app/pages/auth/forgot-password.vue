<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField, FormError } from '@nuxt/ui'

definePageMeta({
    layout: 'auth',
    title: 'Forgot Password | NowIP',
    meta: [
        { name: 'description', content: 'Reset your password' }
    ]
});

const toast = useToast();

const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    required: true
}]

const schema = z.object({
    email: z.email('Invalid email address'),
});

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {

    // const result = await useAPI().postAuthLogin({ body: payload.data });
    
    // if (result.success) {
        
    //     updateAPIClient(result.data.token);

    //     const sessionToken = useCookie('session_token', {
    //         path:     '/',
    //         secure:   true,
    //         sameSite: 'strict',
    //         httpOnly: false,
    //         maxAge:   604800,
    //     });

    //     sessionToken.value = result.data.token;

    //     await SessionStore.fetchAndSetUserInfo();

    //     toast.add({
    //         title: 'Login Successful',
    //         description: 'You have been logged in successfully.'
    //     });
        
    //     await navigateTo(redirectUrl.toString());
    //     return;

    // } else {
    //     toast.add({
    //         title: 'Login Failed',
    //         description: 'An error occurred during login.'
    //     });
    // }
}

</script>

<template>
    <div class="flex flex-col items-center justify-center gap-4 p-4">
        <UPageCard class="w-full max-w-md">
            <UAuthForm :schema="schema" title="Forgot Password" description="Reset your password by entering your email address below."
                icon="i-lucide-mail" :fields="fields" @submit="onSubmit"
                :submit="{
                    label: 'Send Reset Link',
                }"
            >
                <template #footer>
                    <div class="text-center text-sm">
                        Remembered your password? 
                        <NuxtLink to="/auth/login" class="text-primary-600 hover:underline">
                            Login here
                        </NuxtLink>
                    </div>
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>
