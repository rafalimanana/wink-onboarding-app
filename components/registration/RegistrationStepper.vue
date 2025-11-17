<template>
  <div class="flex justify-center items-start mb-16 max-w-xl mx-auto custom_step">
    <template v-for="step in 3" :key="step">
      <div class="step-item transition-opacity duration-300 opacity-100">
        <div :class="stepClass(step)" class="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300">
          {{ step }}
        </div>
        <span class="step-text text-gray-600 mt-2 text-sm font-medium transition-colors duration-300">
          {{ stepLabels[step-1] }}
        </span>
      </div>
      <div class="step-line-container" v-if="step < 3">
          <div class="step-line">
              <div id="line-1-2-fill" class="step-line-fill w-0 left-0"></div>
          </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ currentStep: number }>()
const emit = defineEmits<{ 'step-change': (step: number) => void }>()
const { locale, t } = useI18n();

const stepLabels = [
  t('common.step1'),
  t('common.step2'),
  t('common.step3')
]

const stepClass = (step: number) => {
  if (step === props.currentStep) return 'step-circle  bg-blue-600 text-white border-blue-200'
  if (step < props.currentStep) return 'step-circle  bg-blue-600 text-white border-gray-200'
  return 'bg-white text-gray-400'
}

const textClass = (step: number) => {
  if (step === props.currentStep) return 'text-blue-600'
  if (step < props.currentStep) return 'text-gray-700'
  return 'text-gray-400'
}

const lineBgClass = (step: number) => (props.currentStep >= step ? 'bg-blue-600' : 'bg-gray-200')
const lineFillClass = (step: number) => (props.currentStep >= step ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0')
</script>

<style scoped>
/* Indicateur d'étape (pour contenir le cercle et le texte) */
.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    position: relative;
    z-index: 20; 
    width: auto; 
}

/* Conteneur pour la ligne de progression */
.step-line-container {
    display: flex;
    align-items: flex-start; 
    height: 48px; 
    position: relative;
    z-index: 10;
    width: 30%; 
    margin: 0 20px;
}

@media (min-width: 768px) {
    .step-line-container {
        min-width: 200px; 
        flex-grow: 0;
    }
}

/* Ligne de connexion */
.step-line {
    position: absolute;
    top: 15px; 
    height: 2px; 
    background-color: #e2e8f0; /* bg-gray-200 */
    width: 100%;
}

/* Remplissage de la ligne (Bleu) */
.step-line-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #3b82f6; /* bg-blue-600 */
    transition: width 0.5s ease-in-out;
}

/* Texte de l'étape */
.step-text {
    text-align: center;
    min-height: 20px;
    white-space: nowrap; 
    position: absolute;
    margin-top: 38px;
}

@media (max-width: 720px) {
  .custom_step {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  .step-line-container {
    width: 100%; 
    height: 40px; 
    flex-direction: column;
    margin-top: 40px;
    margin-bottom: 20px;
    margin-left: unset;
    margin-right: unset;
  }
  .step-line {
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
  }
  .step-line-fill {
    width: 100%;
    height: 100%;
  }
}
</style>