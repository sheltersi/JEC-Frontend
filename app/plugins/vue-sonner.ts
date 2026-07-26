import { Toaster, toast } from 'vue-sonner'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Toaster', Toaster)

  return {
    provide: {
      toast,
    },
  }
})

declare module '#app' {
  interface NuxtApp {
    $toast: typeof toast
  }
}
