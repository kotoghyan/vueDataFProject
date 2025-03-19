<script setup>
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const options = [
  {
    id: '0',
    name: 'Cochran_Infiniti_PreRoll_Domain_Blocklist',
    value: 'Cochran_Infiniti_PreRoll_Domain_Blocklist',
  },
  {
    id: '1',
    name: 'Cochran_Honda_Boardman_Domain_Blocklist',
    value: 'Cochran_Honda_Boardman_Domain_Blocklist',
  },
  { id: '2', name: 'Master_PX_Domain_List', value: 'Master_PX_Domain_List' },
  {
    id: '3',
    name: 'TTU_Admin_Sports_BundleBlockList',
    value: 'TTU_Admin_Sports_BundleBlockList',
  },
  { id: '4', name: 'LGKG Domain Blocklist', value: 'LGKG Domain Blocklist' },
  { id: '5', name: 'Cochran_Honda_Domain_Blocklist', value: 'Cochran_Honda_Domain_Blocklist' },
  { id: '6', name: 'TTU_Domain_Blocklist', value: 'TTU_Domain_Blocklist' },
  { id: '7', name: 'Cochran CDJR Domain Blocklist', value: 'Cochran CDJR Domain Blocklist' },
  { id: '8', name: 'Cochran Ford Domain Blocklist', value: 'Cochran Ford Domain Blocklist' },
  {
    id: '9',
    name: 'UC Entertainment Domain Blocklist',
    value: 'UC Entertainment Domain Blocklist',
  },
  {
    id: '10',
    name: 'Cochran Nissan PreRoll Block List',
    value: 'Cochran Nissan PreRoll Block List',
  },
  {
    id: '11',
    name: 'Cochran_PromoCorp_Domain_Blocklist',
    value: 'Cochran_PromoCorp_Domain_Blocklist',
  },
  { id: '12', name: 'Sports_Domains_List', value: 'Sports_Domains_List' },
  { id: '13', name: 'Cochran_Ford_Domain_Blocklist', value: 'Cochran_Ford_Domain_Blocklist' },
  { id: '14', name: 'Subaru PreRoll Domain Blocklist', value: 'Subaru PreRoll Domain Blocklist' },
  { id: '15', name: 'Honda_Domains_Blocklist', value: 'Honda_Domains_Blocklist' },
  { id: '16', name: '535_Approved_DomainList', value: '535_Approved_DomainList' },
  { id: '17', name: 'CBS News/Sports WL', value: 'CBS News/Sports WL' },
  { id: '18', name: 'ColumbiaGas_York_PreRoll_BL', value: 'ColumbiaGas_York_PreRoll_BL' },
  { id: '19', name: 'ColumbiaGas_PGH_PreRoll_BL', value: 'ColumbiaGas_PGH_PreRoll_BL' },
  { id: '20', name: 'Cochran_Domain_BlockList', value: 'Cochran_Domain_BlockList' },
  { id: '21', name: 'ColGas_Domain_Blocklist', value: 'ColGas_Domain_Blocklist' },
  { id: '22', name: 'PilotX_TTU_Domain_List', value: 'PilotX_TTU_Domain_List' },
  {
    id: '23',
    name: 'Cochran_CarStock_Domain_BlockList',
    value: 'Cochran_CarStock_Domain_BlockList',
  },
  { id: '24', name: 'Knisely & Sons PreRoll BL', value: 'Knisely & Sons PreRoll BL' },
  { id: '25', name: 'MissUtility_Targeted_Domains_BL', value: 'MissUtility_Targeted_Domains_BL' },
  { id: '26', name: 'MissUtility_GeoFence_Domains_BL', value: 'MissUtility_GeoFence_Domains_BL' },
  { id: '27', name: 'Local_Morgantown_Domain_List', value: 'Local_Morgantown_Domain_List' },
  { id: '28', name: 'MissUtility_Targeted_WL_Domains', value: 'MissUtility_Targeted_WL_Domains' },
  { id: '29', name: 'WPXI Domain List', value: 'WPXI Domain List' },
  {
    id: '30',
    name: 'ReduceTraffic_DomainList_TribLive',
    value: 'ReduceTraffic_DomainList_TribLive',
  },
  { id: '31', name: 'Local_Pittsburgh_Domains_WL', value: 'Local_Pittsburgh_Domains_WL' },
  { id: '32', name: 'Domain_Block_List', value: 'Domain_Block_List' },
  { id: '33', name: 'WTAJ_Domain_List', value: 'WTAJ_Domain_List' },
  { id: '34', name: 'Brentwood Bank HELOC Block List', value: 'Brentwood Bank HELOC Block List' },
  { id: '35', name: 'Domain Desktop_MW Block List', value: 'Domain Desktop_MW Block List' },
  { id: '36', name: 'iCube Nashville WL', value: 'iCube Nashville WL' },
  { id: '37', name: 'iCube Memphis WL', value: 'iCube Memphis WL' },
  { id: '38', name: 'icube Block List', value: 'icube Block List' },
  {
    id: '39',
    name: 'California University of PA Block List',
    value: 'California University of PA Block List',
  },
  {
    id: '40',
    name: 'Columbia Gas: Count on Columbia Keyword Block List',
    value: 'Columbia Gas: Count on Columbia Keyword Block List',
  },
  {
    id: '41',
    name: 'Columbia Gas: Count on Columbia Lat/Long Block List',
    value: 'Columbia Gas: Count on Columbia Lat/Long Block List',
  },
  { id: '42', name: 'University of Pitts Block List', value: 'University of Pitts Block List' },
  { id: '43', name: 'LIVE Casino Block List', value: 'LIVE Casino Block List' },
  {
    id: '44',
    name: 'Tennessee Tech Preview Day Block List',
    value: 'Tennessee Tech Preview Day Block List',
  },
  { id: '45', name: 'BB Kasasa Union Block List', value: 'BB Kasasa Union Block List' },
  { id: '46', name: 'BB Love Block List', value: 'BB Love Block List' },
  {
    id: '47',
    name: 'BB Kasasa South Hills Block List',
    value: 'BB Kasasa South Hills Block List',
  },
]

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="domain_list"
    title="Domain List"
    :list="options"
    info="To target domains, you must first create a 'domain list'. To create a domain list click on the '+New' button, search the 'List' option and then search 'Domain List' as the list type. Once your domain list is created it will appear here for you to target."
    :fields="['search']"
    :module="props.module"
  />
</template>
