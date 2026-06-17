 
<template>
  <div class="mt-4">
    <div class="justify-content-between align-items-center">
      <h5 class="mb-0">FrontEnd</h5>
      <span class="text-muted fs-14">All Activity</span>
    </div>

    <div class="mt-3 px-5">
      <div class="row g-3">
        <div class="col-12" v-for="el in showActivity" :key="el.id">
          <div class="card rounded-card border">
            <div class="card-body">
              <!-- Fixed: Proper conditional class binding -->
              <span :class="[

                'fs-14',
                'p-1',
                'rounded-card',
                el.action == 'create' ? ['bg-green', 'text-green'] : (el.action == 'assign') ? ['bg-blue', 'text-blue'] : ['bg-orange', 'text-orange']
              ]">

                <span v-if="el.action === 'create'">
                  <Plus size="12" />
                </span>
                <span v-else-if="el.action === 'assign'">
                  <UserRound size="12" />
                </span>
                <span v-else>
                  <SquarePen size="12" />
                </span>
                {{ el.action }}
              </span>

              <div class="d-flex align-items-center justify-content-between bg-white rounded-card px-0 py-2 mt-3 w-100">
                <div class="d-flex align-items-center gap-2">
                  <span class="pro-img">
                    <img :src="el.created_by?.avatar || '/default-avatar.png'" alt="User avatar">
                  </span>
                  <span class="title-text fs-14 fw-semibold text-dark">
                    {{ el.created_by?.name || 'Unknown User' }}
                  </span>
                </div>
                <span class="fs-12 text-muted bg-light px-2 py-1 rounded-btn-sm">
                  {{ formatTime(el.created_at) }}
                </span>
              </div>

              <div class="p-2 bg-accent rounded-card border mt-2">
                <p class="p-0 m-0">{{ el.message || 'No message provided' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!showActivity || showActivity.length === 0" class="col-12">
          <div class="text-center py-5">
            <p class="text-muted">No activity found</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useActivityStore } from '@/stores/activity/activity';
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const activityStore = useActivityStore();
const route = useRoute();
const workspaceId = computed(() => route.params.workspace_id);
const teamId = computed(() => route.params.team_id);
const showActivity = computed(() => activityStore.teamActivity?.data || []);

const formatTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  } catch (error) {
    return '';
  }
};

const loadActivity = async () => {
  if (workspaceId.value && teamId.value) {
    try {
      await activityStore.getTeamActivity(workspaceId.value, teamId.value);
    } catch (error) {
      console.error('Failed to load activity:', error);
    }
  } else {
    console.warn('Workspace ID or Team ID is missing');
  }
};

onMounted(loadActivity);

watch([workspaceId, teamId], () => {
  loadActivity();
}, { deep: true });

</script>

<style scoped>
.card .btn-create {
  padding: 4px 12px;
  border-radius: 16px !important;
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0.05);
}

.pro-img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pro-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rounded-card {
  border-radius: 8px;
}

.rounded-btn-sm {
  border-radius: 12px;
}
</style>
