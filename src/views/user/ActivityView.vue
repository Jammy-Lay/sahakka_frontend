<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <h5 class="mb-0">FrontEnd</h5>
      <span class="text-mute fs-14">All Activity</span>
    </div>
    
    <div class="my-4">
      <span class="date-of py-1 bg-white rounded-2 mt-3 fs-14 px-3 rounded-card">
        {{ formattedDate }}
      </span>
    </div>

    <div class="mt-3 px-5">
      <div class="row g-3">
        <div class="col-12" v-for="activity in activities" :key="activity.id">
          <div class="card rounded-card border">
            <div class="card-body">
              <span :class="['btn-create', 'py-1', activity.buttonClass]">
                {{ activity.buttonIcon }} {{ activity.buttonText }}
              </span>
              
              <div class="d-flex align-items-center justify-content-between bg-white rounded-card px-0 py-2 mt-3 w-100"
                style="border-color: #e4e4e7;">
                <div class="d-flex align-items-center gap-2 boder-0 px-0 mx-0">
                  <span class="pro-img">
                    <img :src="activity.userAvatar" class="p-0 m-x" :alt="activity.userName" 
                         @error="handleImageError" />
                  </span>
                  <span class="title-text fs-14 fw-semibold text-dark">{{ activity.userName }}</span>
                </div>
                <span class="fs-12 text-mute bg-mute px-2 py-1 rounded-btn-sm">{{ activity.timeAgo }}</span>
              </div>
              
              <div class="p-2 bg-accent rounded-card border mt-2">
                <p class="p-0 m-0">{{ activity.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-if="!activities.length" class="col-12">
          <div class="text-center py-5 bg-accent rounded-card">
            <p class="text-mute mb-0">No activities yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useActivityStore } from '@/stores/activity/activity';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activityStore = useActivityStore();
const activities = ref([]);

// Get IDs from route params
const workspaceId = computed(() => {
  return route.params.workspace_id || 
         route.params.workspaceId || 
         route.params.workspace || 
         '4';
});

const teamId = computed(() => {
  return route.params.team_id || 
         route.params.teamId || 
         route.params.team || 
         '7';
});

const taskId = computed(() => {
  return route.params.task_id || 
         route.params.taskId || 
         route.params.task || 
         null;
});

// Format current date
const formattedDate = computed(() => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
});

// Fetch activities based on context
const fetchActivities = async () => {
  try {
    let data;
    
    if (taskId.value) {
      data = await activityStore.getTaskActivity(workspaceId.value,teamId.value,taskId.value);
    } else {
      data = await activityStore.getTeamActivity(workspaceId.value,teamId.value);
    }
    
    if (data && Array.isArray(data)) {
      activities.value = data.map(activity =>activityStore.formatActivity(activity));
    } else {
      activities.value = [];
    }
    
  } catch (err) {
    console.error('Failed to fetch activities:', err);
    activities.value = [];
  }
};

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = '/src/assets/image/default-avatar.jpg';
};

onMounted(() => {
  fetchActivities();
});
</script>

<style scoped>


.card .btn-create {
  padding: 4px 12px;
  border-radius: 16px !important;
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  background-color: rgba(0,0,0,0.05);
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


.rounded-btn-sm {
  border-radius: 8px;
}

.bg-mute {
  background-color: #f8f9fa;
}

.bg-accent {
  background-color: #f8f9fa;
}


</style>