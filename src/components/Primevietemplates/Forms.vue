
<template>
    <div class="container">
        <form class="flex flex-wrap justify-center items-center gap-4">
          <div class="card">
                <Password v-model="value" :feedback="false" />
            </div>
    </form> 
    <form class="card flex flex-col items-center gap-4">
          <Password v-model="value">
                <template #header>
                    <div class="font-semibold text-xm mb-4">Pick a password</div>
                </template>
                <template #footer>
                    <Divider />
                    <ul class="pl-2 ml-2 my-0 leading-normal">
                        <li>At least one lowercase</li>
                        <li>At least one uppercase</li>
                        <li>At least one numeric</li>
                        <li>Minimum 8 characters</li>
                    </ul>
                </template>
            </Password>
        </form>
        <form class="card flex gap-4">
          <FloatLabel variant="over">
                <Password v-model="value1" inputId="over_label" />
                <label for="over_label">Over Label</label>
            </FloatLabel>
            <FloatLabel variant="in">
                <Password v-model="value2" inputId="in_label" variant="filled" />
                <label for="in_label">In Label</label>
            </FloatLabel>
          <FloatLabel variant="on">
                <Password v-model="value3" inputId="on_label" />
                <label for="on_label">On Label</label>
            </FloatLabel>
        </form>
     <form>
          <FloatLabel>
            <Password v-model="value4" inputId="password" variant="filled" />
        <label for="password">Password</label>
          </FloatLabel>
    </form>
    <form>
        <div class="card flex flex-wrap justify-center gap-4">
            <Password v-model="value1" :invalid="!value1" placeholder="Password" />
            <Password v-model="value2" :invalid="!value2" variant="filled" placeholder="Password" />
        </div>
    </form>
    </div>
     
        
    
    
        <div class="card">
            <MegaMenu :model="items" class="p-4 bg-surface-0" style="border-radius: 3rem">
                <template #start>
                    <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8">
                        <path
                            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                            fill="var(--p-primary-color)"
                        />
                        <path
                            d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                            fill="var(--p-text-color)"
                        />
                    </svg>
                </template>
                <template #item="{ item }">
                    <a v-if="item.root" class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg uppercase" style="border-radius: 2rem">
                        <span>{{ item.label }}</span>
                    </a>
                    <a v-else-if="!item.image" class="flex items-center p-4 cursor-pointer mb-2 gap-3">
                        <span class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12">
                            <i :class="[item.icon, 'text-lg']"></i>
                        </span>
                        <span class="inline-flex flex-col gap-1">
                            <span class="font-bold text-lg">{{ item.label }}</span>
                            <span class="whitespace-nowrap">{{ item.subtext }}</span>
                        </span>
                    </a>
                    <div v-else class="flex flex-col items-start gap-4 p-2">
                        <img alt="megamenu-demo" :src="item.image" class="w-full" />
                        <span>{{ item.subtext }}</span>
                        <Button :label="item.label" outlined />
                    </div>
                </template>
                <template #end>
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
                </template>
            </MegaMenu>
        </div>
    </template>
    
     
    
    
    <script setup>
    import { useRouter } from 'vue-router';

const router = useRouter();
    import Password from 'primevue/password';
    import { ref } from 'vue';
    
    const value = ref(null);
    const value1 = ref(null);
    const value2 = ref(null);
    const value3 = ref(null);
    const value4 = ref(null);

    </script>
    
    <style scoped>
    
    body{
         place-self: contain; 
    }
    div {
        
        max-width: 100%;
        max-height: 9rem;
        padding-top: rem;
        font-family: Arial, Helvetica, sans-serif;
        display: inline-flex; 
         align-content: center;
        place-content: initialise;
        place-self: center;
    }
    
    form {
        padding-top: 3rem;
        font-family: Arial, Helvetica, sans-serif;
        height: 3.2rem;
    }
    .container{ max-width: 100%;
        max-height: 9rem;
        padding-top: rem;
        font-family: Arial, Helvetica, sans-serif;
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 979px;
      padding-top: 3rem;} 
    </style>