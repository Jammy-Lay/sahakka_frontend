<template>
  <div class="">
    <!-- Header -->
    <div class="position-sticky top-0 z-1 header pt-5 pb-2 bg-body">
      <div class="d-flex align-items-start justify-content-between mb-3">
        <div>
          <h2 class="fw-semibold fs-5 mb-1">{{ getTeamById.title }}</h2>
          <p class="text-secondary fs-13 mb-0">{{ getTeamById.description }}</p>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn btn-white bg-white rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1"
          >
            <Filter size="16" /> Filter
          </button>
          <BaseButton
            class="fs-13 py-1 px-3 rounded-btn"
            btn-name="New Task"
            icon="plus"
            @click="showCreateTask = true"
          />
        </div>
      </div>

      <!-- Create Task Modal -->
      <n-modal v-model:show="showCreateTask" :mask-closable="true">
        <div class="bg-white rounded-card" style="width: 750px">
          <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
            <span class="fw-medium fs-5">Create task</span>
            <n-button
              text
              size="small"
              @click="showCreateTask = false"
              class="hover-circle p-1 rounded-circle"
            >
              <X size="18" />
            </n-button>
          </div>

          <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />

          <div class="px-5 pt-2 pb-4">
            <label class="mb-2 fs-13 text-dark mt-2">Title</label>
            <BaseInput
              v-model="form.title"
              input-placeholder="Title"
              input-class="py-2 fs-13 rounded-btn-sm bg-white mb-3"
            />
            <label class="mb-2 fs-13 text-dark">Description</label>
            <textarea
              v-model="form.description"
              placeholder="Description"
              class="form-control fs-13 rounded-btn-sm bg-white mb-3 base-input"
              style="min-height: 120px; resize: vertical; border: 1px solid #e4e4e7"
            />

            <div class="d-flex align-items-center gap-3 mb-3">
              <span class="fs-13 fw-medium">Type of task</span>
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showTypePop"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 160px"
              >
                <template #trigger>
                  <span
                    class="tab-info cursor-pointer"
                    :class="[typeConfig[form.type]?.bg, typeConfig[form.type]?.text]"
                  >
                    <Circle size="10" :fill="typeConfig[form.type]?.fill" />
                    {{ form.type }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in typeConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                    @click="
                      form.type = key;
                      showTypePop = false;
                    "
                  >
                    <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                    {{ key }}
                  </div>
                </div>
              </n-popover>
            </div>

            <div class="meta-grid-modal">
              <span class="fs-13 text-mute d-flex align-items-center gap-1">
                <circle-dashed size="14" /> Status
              </span>
              <span class="fs-13 text-mute d-flex align-items-center gap-1">
                <ghost size="14" /> Priority
              </span>
              <span class="fs-13 text-mute d-flex align-items-center gap-1">
                <users size="14" /> Assignee
              </span>
              <span
                class="fs-13 text-mute d-flex align-items-center gap-1"
                style="grid-column: span 2"
              >
                <calendar size="14" /> Date range
              </span>

              <!-- Status -->
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showStatusPop"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 160px"
              >
                <template #trigger>
                  <span
                    class="tab-info w-fit fw-medium cursor-pointer"
                    :class="[
                      statusConfig[form.status]?.bg,
                      statusConfig[form.status]?.text,
                    ]"
                  >
                    <component :is="statusConfig[form.status]?.icon" size="14" />
                    {{ statusConfig[form.status]?.label }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in statusConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                    @click="
                      form.status = key;
                      showStatusPop = false;
                    "
                  >
                    <component :is="cfg.icon" size="14" />
                    {{ cfg.label }}
                  </div>
                </div>
              </n-popover>

              <!-- Priority -->
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showPriorityPop"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 140px"
              >
                <template #trigger>
                  <span
                    class="tab-info w-fit fw-medium cursor-pointer"
                    :class="[
                      priorityConfig[form.priority]?.bg,
                      priorityConfig[form.priority]?.text,
                    ]"
                  >
                    <Circle
                      size="10"
                      :fill="priorityConfig[form.priority]?.fill"
                      stroke-width="0"
                    />
                    {{ form.priority }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in priorityConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                    @click="
                      form.priority = key;
                      showPriorityPop = false;
                    "
                  >
                    <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                    {{ key }}
                  </div>
                </div>
              </n-popover>

              <!-- Assignee -->
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showAssigneePop"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 180px"
              >
                <template #trigger>
                  <span class="d-flex align-items-center gap-2 fs-13 cursor-pointer">
                    <img
                      :src="form.assignee?.avatar || getMe.avatar"
                      class="rounded-circle object-fit-cover"
                      style="width: 22px; height: 22px"
                    />
                    <n-ellipsis
                      style="max-width: 60px"
                      :tooltip="{
                        style: {
                          fontSize: '11px',
                          padding: '4px 8px',
                          borderRadius: '8px',
                        },
                      }"
                    >
                      {{ form.assignee?.name || getMe.name }}
                    </n-ellipsis>
                    <span
                      v-if="!form.assignee || form.assignee.user_id === getMe.user_id"
                      class="text-mute fs-11"
                      >(You)</span
                    >
                  </span>
                </template>
                <div>
                  <div
                    v-for="member in teamMembers"
                    :key="member.user_id"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                    @click="
                      form.assignee = member;
                      showAssigneePop = false;
                    "
                  >
                    <img
                      :src="member.avatar"
                      class="rounded-circle object-fit-cover"
                      style="width: 22px; height: 22px"
                    />
                    {{ member.name }}
                    <span v-if="member.user_id === getMe.user_id" class="text-mute fs-11"
                      >(You)</span
                    >
                  </div>
                </div>
              </n-popover>

              <n-date-picker
                v-model:value="form.date_range"
                type="daterange"
                clearable
                :to="false"
                class="custom-picker"
              />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-3 px-4 py-3">
            <button
              class="btn btn-outline-light border-0 text-dark rounded-btn fs-14 fw-bold px-4"
              @click="showCreateTask = false"
            >
              Close
            </button>
            <button
              type="submit"
              class="btn bg-btn w-fit rounded-btn py-2 px-3 fs-14"
              :disabled="isLoading"
              @click="handleCreateTask"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              {{ isLoading ? "Creating" : "Create Task" }}
            </button>
          </div>
        </div>
      </n-modal>

      <!-- Task Detail Modal -->
      <n-modal v-model:show="showTaskModal" :mask-closable="true">
        <div
          v-if="selectedTask"
          class="bg-white task-detail-modal text-nowrap"
          :class="{ 'modal-expanded': showActivity }"
        >
          <!-- Modal Top Bar -->
          <div class="detail-topbar">
            <span class="fw-medium fs-5">Detail</span>
            <div class="d-flex align-items-center gap-2">
              <button
                class="icon-action-btn"
                @click="showActivity = !showActivity"
                :title="showActivity ? 'Collapse' : 'Show activity'"
              >
                <Expand v-if="!showActivity" size="16" />
                <Shrink v-else size="16" />
              </button>
              <button class="icon-action-btn" @click="showTaskModal = false">
                <X size="18" />
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="detail-body">
            <!-- Left / Main Panel -->
            <div class="detail-main" :class="{ 'with-activity': showActivity }">
              <div class="detail-scroll">
                <!-- Assignee row -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div class="d-flex align-items-center gap-2">
                    <img
                      v-if="selectedTask.created_by?.avatar"
                      :src="selectedTask.created_by.avatar"
                      class="rounded-circle object-fit-cover"
                      style="width: 28px; height: 28px"
                    />
                    <div v-else class="default-avatar-sm">
                      {{ selectedTask.created_by?.name?.charAt(0) || "?" }}
                    </div>
                    <span class="fw-semibold fs-13">{{
                      selectedTask.created_by?.name || "Unknown"
                    }}</span>
                    <span class="text-mute fs-13">· assign to you</span>
                  </div>
                  <!-- Type badge -->
                  <n-popover
                    trigger="click"
                    placement="bottom-end"
                    v-model:show="showDetailTypePop"
                    :show-arrow="false"
                    style="border-radius: 12px; padding: 6px; width: 160px"
                  >
                    <template #trigger>
                      <span
                        class="tab-info fw-medium cursor-pointer"
                        :class="[
                          typeConfig[selectedTask.type]?.bg,
                          typeConfig[selectedTask.type]?.text,
                        ]"
                        @click.stop
                      >
                        <Circle
                          size="10"
                          :fill="typeConfig[selectedTask.type]?.fill"
                          stroke-width="0"
                        />
                        {{ selectedTask.type }}
                      </span>
                    </template>
                    <div>
                      <div
                        v-for="(cfg, key) in typeConfig"
                        :key="key"
                        class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                        @click="
                          selectedTask.type = key;
                          showDetailTypePop = false;
                        "
                      >
                        <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                        {{ key }}
                      </div>
                    </div>
                  </n-popover>
                </div>

                <!-- Meta rows -->
                <div class="detail-meta-rows mb-4">
                  <div class="detail-meta-row">
                    <span class="detail-meta-label"
                      ><CircleDashed size="14" /> Status</span
                    >
                    <n-popover
                      trigger="click"
                      placement="bottom-start"
                      v-model:show="showDetailStatusPop"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 6px; width: 160px"
                    >
                      <template #trigger>
                        <span
                          class="tab-info w-fit fw-medium cursor-pointer"
                          :class="[
                            statusConfigFull[selectedTask.status]?.bg,
                            statusConfigFull[selectedTask.status]?.text,
                          ]"
                          @click.stop
                        >
                          <component
                            :is="statusConfigFull[selectedTask.status]?.icon"
                            size="14"
                          />
                          {{ statusConfigFull[selectedTask.status]?.label }}
                        </span>
                      </template>
                      <div>
                        <div
                          v-for="(cfg, key) in statusConfigFull"
                          :key="key"
                          class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                          @click="
                            selectedTask.status = key;
                            showDetailStatusPop = false;
                          "
                        >
                          <component :is="cfg.icon" size="14" />
                          {{ cfg.label }}
                        </div>
                      </div>
                    </n-popover>
                  </div>

                  <div class="detail-meta-row">
                    <span class="detail-meta-label"><Ghost size="14" /> Priority</span>
                    <n-popover
                      trigger="click"
                      placement="bottom-start"
                      v-model:show="showDetailPriorityPop"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 6px; width: 140px"
                    >
                      <template #trigger>
                        <span
                          class="tab-info w-fit fw-medium cursor-pointer"
                          :class="[
                            priorityConfig[selectedTask.priority]?.bg,
                            priorityConfig[selectedTask.priority]?.text,
                          ]"
                          @click.stop
                        >
                          <Circle
                            size="10"
                            :fill="priorityConfig[selectedTask.priority]?.fill"
                            stroke-width="0"
                          />
                          {{ selectedTask.priority }}
                        </span>
                      </template>
                      <div>
                        <div
                          v-for="(cfg, key) in priorityConfig"
                          :key="key"
                          class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                          @click="
                            selectedTask.priority = key;
                            showDetailPriorityPop = false;
                          "
                        >
                          <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                          {{ key }}
                        </div>
                      </div>
                    </n-popover>
                  </div>

                  <div class="detail-meta-row mt-1">
                    <span class="detail-meta-label"><Users size="14" /> Assignee</span>
                    <span class="d-flex align-items-center gap-2 fs-13">
                      <template v-if="!selectedTask.assigned_to?.user_id">
                        <img
                          src="../../assets/image/default-avatar.png"
                          class="rounded-circle object-fit-cover"
                          style="width: 22px; height: 22px"
                        />
                        <span class="text-mute">No assignee</span>
                      </template>
                      <template v-else>
                        <img
                          :src="selectedTask.assigned_to.avatar"
                          class="rounded-circle object-fit-cover"
                          style="width: 22px; height: 22px"
                        />
                        <n-ellipsis
                          style="max-width: 80px"
                          :tooltip="{
                            style: {
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '8px',
                            },
                          }"
                        >
                          {{ selectedTask.assigned_to.name }}
                        </n-ellipsis>
                        <span
                          v-if="selectedTask.assigned_to.user_id === getMe.user_id"
                          class="text-secondary fs-11"
                          >(You)</span
                        >
                      </template>
                    </span>
                  </div>

                  <div class="detail-meta-row mt-2">
                    <span class="detail-meta-label"
                      ><Calendar size="14" /> Start date</span
                    >
                    <n-popover
                      v-model:show="showDetailStartDatePop"
                      trigger="click"
                      placement="bottom-start"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 0; overflow: hidden"
                    >
                      <template #trigger>
                        <span
                          class="fs-13 cursor-pointer date-trigger"
                          :class="[
                            selectedTask.start_date ? 'text-dark' : 'text-mute',
                            showDetailStartDatePop ? 'bg-active' : '',
                          ]"
                          @click.stop
                        >
                          {{
                            selectedTask.start_date
                              ? formatDate(selectedTask.start_date)
                              : "Set date"
                          }}
                        </span>
                      </template>
                      <div class="custom-picker">
                        <n-date-picker
                          :value="dateToTs(selectedTask.start_date)"
                          type="date"
                          :to="false"
                          panel
                          @update:value="
                            (val) => {
                              selectedTask.start_date = formatToYMD(val);
                              showDetailStartDatePop = false;
                            }
                          "
                        />
                      </div>
                    </n-popover>
                  </div>

                  <div class="detail-meta-row mt-2">
                    <span class="detail-meta-label"><Calendar size="14" /> End Date</span>
                    <n-popover
                      v-model:show="showDetailEndDatePop"
                      trigger="click"
                      placement="bottom-start"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 0; overflow: hidden"
                    >
                      <template #trigger>
                        <span
                          class="fs-13 cursor-pointer date-trigger"
                          :class="[
                            selectedTask.end_date ? 'text-dark' : 'text-mute',
                            showDetailEndDatePop ? 'bg-active' : '',
                          ]"
                          @click.stop
                        >
                          {{
                            selectedTask.end_date
                              ? formatDate(selectedTask.end_date)
                              : "Set date"
                          }}
                        </span>
                      </template>
                      <div class="custom-picker">
                        <n-date-picker
                          :value="dateToTs(selectedTask.end_date)"
                          type="date"
                          :to="false"
                          panel
                          @update:value="
                            (val) => {
                              selectedTask.end_date = formatToYMD(val);
                              showDetailEndDatePop = false;
                            }
                          "
                        />
                      </div>
                    </n-popover>
                  </div>
                </div>

                <!-- Title & Description -->
                <p class="fw-bold mb-2" style="font-size: 18px">
                  {{ selectedTask.title }}
                </p>
                <p class="fs-13 text-mute mb-4">
                  {{ selectedTask.description || "No description provided" }}
                </p>

                <!-- File/Link Attachment -->
                <p class="fw-semibold fs-15 mb-2">
                  File attachment <Link size="15" class="ms-1" />
                </p>
                <div class="attach-upload-box mb-4">
                  <div class="attach-pdf-icon">
                    <FileText size="18" color="#e24b4a" />
                  </div>
                  <span class="fs-13 text-mute">Embed a PDF</span>
                </div>

                <!-- Messages -->
                <p class="fw-semibold fs-15 mb-2">
                  Messages <message-circle size="16" class="text-mute ms-1" />
                </p>
                <textarea
                  v-model="taskMessage"
                  placeholder="Send messages"
                  class="msg-textarea"
                />
              </div>
            </div>

            <!-- Right / Activity Panel -->
            <transition name="slide-activity">
              <div v-if="showActivity" class="detail-activity">
                <div class="activity-scroll">
                  <p class="fw-semibold fs-14 mb-3">Task activity</p>

                  <template
                    v-if="selectedTask.activities && selectedTask.activities.length"
                  >
                    <template v-for="(group, gi) in groupedActivities" :key="gi">
                      <div class="activity-date-label">
                        <Calendar size="13" />
                        {{ group.date }}
                      </div>
                      <div
                        v-for="(act, ai) in group.items"
                        :key="ai"
                        class="activity-card"
                      >
                        <span class="act-tag" :class="actTagClass(act.action)">
                          <component :is="actTagIcon(act.action)" size="11" />
                          {{ act.action }}
                        </span>
                        <div
                          class="d-flex align-items-center justify-content-between mb-2"
                        >
                          <div class="d-flex align-items-center gap-2">
                            <img
                              v-if="act.user?.avatar"
                              :src="act.user.avatar"
                              class="rounded-circle object-fit-cover"
                              style="width: 24px; height: 24px"
                            />
                            <div v-else class="default-avatar-sm">
                              {{ act.user?.name?.charAt(0) || "?" }}
                            </div>
                            <span class="fw-semibold fs-13">{{ act.user?.name }}</span>
                          </div>
                          <span class="fs-11 text-mute">{{ act.time }}</span>
                        </div>
                        <div class="act-note">{{ act.note }}</div>
                      </div>
                    </template>
                  </template>

                  <!-- Fallback demo activities if no real data -->
                  <template v-else>
                    <div class="activity-date-label">
                      <Calendar size="13" />
                      {{ formatDate(selectedTask.start_date) }}
                    </div>
                    <div class="activity-card">
                      <span class="act-tag act-tag-create"
                        ><Plus size="11" /> Create</span
                      >
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center gap-2">
                          <img
                            v-if="selectedTask.created_by?.avatar"
                            :src="selectedTask.created_by.avatar"
                            class="rounded-circle object-fit-cover"
                            style="width: 24px; height: 24px"
                          />
                          <div v-else class="default-avatar-sm">
                            {{ selectedTask.created_by?.name?.charAt(0) || "?" }}
                          </div>
                          <span class="fw-semibold fs-13">{{
                            selectedTask.created_by?.name
                          }}</span>
                        </div>
                        <span class="fs-13 text-dark bg-accent px-2 rounded-pill py-1"
                          >9:41 AM</span
                        >
                      </div>
                      <div class="act-note">created this task</div>
                    </div>
                    <div class="activity-card" v-if="selectedTask.assigned_to?.user_id">
                      <span class="act-tag act-tag-assign"
                        ><UserCheck size="11" /> Assign</span
                      >
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center gap-2">
                          <img
                            v-if="selectedTask.assigned_to?.avatar"
                            :src="selectedTask.assigned_to.avatar"
                            class="rounded-circle object-fit-cover"
                            style="width: 24px; height: 24px"
                          />
                          <div v-else class="default-avatar-sm">
                            {{ selectedTask.assigned_to?.name?.charAt(0) || "?" }}
                          </div>
                          <span class="fw-semibold fs-13">{{
                            selectedTask.assigned_to?.name
                          }}</span>
                        </div>
                        <span class="fs-11 text-mute bg-accent px-2">9:41 AM</span>
                      </div>
                      <div class="act-note">self-assigned {{ selectedTask.title }}</div>
                    </div>
                  </template>
                </div>
              </div>
            </transition>
          </div>

          <!-- Modal Bottom Bar -->
          <div class="detail-bottombar">
            <span class="fw-semibold fs-5">Submission</span>
            <button
              class="btn bg-btn rounded-btn rounded-btn py-1 px-3"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              <Send v-else :size="16" class="me-2" />
              {{ isLoading ? "Submitting..." : "Submit" }}
            </button>
          </div>
        </div>
      </n-modal>

      <!-- Status Tabs -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span
          class="tab-title"
          :class="activeTab === '' ? 'tab-dark' : 'tab-default'"
          @click="handleTabClick('')"
          ><layout-dashboard size="16" /> All tasks</span
        >

        <span
          class="tab-title"
          :class="
            activeTab === 'todo' ? 'bg-blue-active text-white' : 'bg-blue text-blue'
          "
          @click="handleTabClick('todo')"
          ><circle-check-big size="16" /> To do</span
        >

        <span
          class="tab-title"
          :class="
            activeTab === 'in_progress'
              ? 'bg-orange-active text-white'
              : 'bg-orange text-orange'
          "
          @click="handleTabClick('in_progress')"
          ><circle-dashed size="16" /> In process</span
        >

        <span
          class="tab-title"
          :class="
            activeTab === 'submitted'
              ? 'bg-purple-active text-white'
              : 'bg-purple text-purple'
          "
          @click="handleTabClick('submitted')"
          ><Send size="16" /> Submitted</span
        >

        <span
          class="tab-title"
          :class="
            activeTab === 'approved'
              ? 'bg-green-active text-white'
              : 'bg-green text-green'
          "
          @click="handleTabClick('approved')"
          ><CircleCheck size="16" /> Approved</span
        >

        <span
          class="tab-title"
          :class="
            activeTab === 'rejected' ? 'bg-red-active text-white' : 'bg-red text-danger'
          "
          @click="handleTabClick('rejected')"
          ><CircleX size="16" /> Rejected</span
        >
      </div>
    </div>

    <n-empty
      v-if="getTask.length === 0"
      description="No Data"
      class="mt-8"
      style="--n-icon-size: 45px; font-size: 14px"
    />

    <!-- Task Cards -->
    <n-scrollbar style="max-height: 100%" v-else>
      <div class="d-flex flex-column gap-3">
        <div
          class="bg-white rounded-card border border-0"
          style="padding: 20px; min-height: 220px; cursor: pointer"
          v-for="task in getTask"
          :key="task.id"
          @click="openTaskModal(task)"
        >
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
              <template v-if="!task.assigned_to?.user_id">
                <img
                  src="../../assets/image/default-avatar.png"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-medium text-mute fs-13">No assignee</span>
              </template>
              <template
                v-else-if="task.created_by?.user_id === task.assigned_to?.user_id"
              >
                <img
                  :src="task.created_by?.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-semibold fs-13">{{ task.created_by?.name }}</span>
                <span class="fw-bold text-mute fs-12">·</span>
                <span class="text-mute fs-13">Self-assigned the task</span>
              </template>
              <template v-else>
                <img
                  :src="task.assigned_to?.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-semibold fs-13">{{ task.assigned_by?.name }}</span>
                <span class="fw-bold text-mute fs-12">·</span>
                <span class="text-mute fs-13">Assigned to you</span>
              </template>
            </div>

            <n-popover
              :show="isPopOpen(task.id, 'type')"
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 6px; width: 140px"
              @update:show="(val) => (openPop[`${task.id}_type`] = val)"
            >
              <template #trigger>
                <span
                  class="tab-info w-fit fw-medium cursor-pointer"
                  :class="[typeConfig[task.type]?.bg, typeConfig[task.type]?.text]"
                  @click.stop
                >
                  <Circle
                    size="10"
                    :fill="typeConfig[task.type]?.fill"
                    stroke-width="0"
                  />
                  {{ task.type }}
                </span>
              </template>
              <div>
                <div
                  v-for="(cfg, key) in typeConfig"
                  :key="key"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                  @click="
                    task.type = key;
                    closePop(task.id, 'type');
                  "
                >
                  <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                  {{ key }}
                </div>
              </div>
            </n-popover>
          </div>

          <div class="meta-grid mb-3">
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <circle-dashed size="15" /> Status
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <ghost size="15" /> Priority
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <Users size="15" /> Assignee
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <Calendar size="15" /> Start Date
            </span>
            <span class="d-flex align-items-center gap-1 fs-14 text-mute">
              <Calendar size="15" /> End Date
            </span>

            <!-- Status -->
            <n-popover
              :show="isPopOpen(task.id, 'status')"
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 6px; width: 160px"
              @update:show="(val) => (openPop[`${task.id}_status`] = val)"
            >
              <template #trigger>
                <span
                  class="tab-info w-fit fw-medium cursor-pointer"
                  :class="[
                    statusConfig[task.status]?.bg,
                    statusConfig[task.status]?.text,
                  ]"
                  @click.stop
                >
                  <component :is="statusConfig[task.status]?.icon" size="16" />
                  {{ statusConfig[task.status]?.label }}
                </span>
              </template>
              <div>
                <div
                  v-for="(cfg, key) in statusConfig"
                  :key="key"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                  @click="
                    task.status = key;
                    closePop(task.id, 'status');
                  "
                >
                  <component :is="cfg.icon" size="14" />
                  {{ cfg.label }}
                </div>
              </div>
            </n-popover>

            <!-- Priority -->
            <n-popover
              :show="isPopOpen(task.id, 'priority')"
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 6px; width: 140px"
              @update:show="(val) => (openPop[`${task.id}_priority`] = val)"
            >
              <template #trigger>
                <span
                  class="tab-info w-fit fw-medium cursor-pointer"
                  :class="[
                    priorityConfig[task.priority]?.bg,
                    priorityConfig[task.priority]?.text,
                  ]"
                  @click.stop
                >
                  <Circle
                    size="10"
                    :fill="priorityConfig[task.priority]?.fill"
                    stroke-width="0"
                  />
                  {{ task.priority }}
                </span>
              </template>
              <div>
                <div
                  v-for="(cfg, key) in priorityConfig"
                  :key="key"
                  class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                  @click="
                    task.priority = key;
                    closePop(task.id, 'priority');
                  "
                >
                  <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                  {{ key }}
                </div>
              </div>
            </n-popover>

            <!-- Assignee -->
            <span class="d-flex align-items-center gap-2 fs-13">
              <template v-if="!task.assigned_to?.user_id">
                <img
                  src="../../assets/image/default-avatar.png"
                  class="rounded-circle object-fit-cover"
                  style="width: 22px; height: 22px"
                />
                <span class="text-mute">No assignee</span>
              </template>
              <template v-else>
                <img
                  :src="task.assigned_to.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 22px; height: 22px"
                />
                <n-ellipsis
                  style="max-width: 60px"
                  :tooltip="{
                    style: { fontSize: '11px', padding: '4px 8px', borderRadius: '8px' },
                  }"
                >
                  {{ task.assigned_to.name }}
                </n-ellipsis>
                <span
                  v-if="task.assigned_to.user_id === getMe.user_id"
                  class="text-secondary fs-11"
                >
                  (You)
                </span>
              </template>
            </span>

            <!-- Start Date -->
            <n-popover
              :show="isPopOpen(task.id, 'start_date')"
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 0; overflow: hidden"
              @update:show="(val) => (openPop[`${task.id}_start_date`] = val)"
            >
              <template #trigger>
                <span
                  class="fs-13 cursor-pointer rounded-3 date-trigger"
                  :class="[
                    task.start_date ? 'text-dark' : 'text-mute',
                    isPopOpen(task.id, 'start_date') ? 'bg-active' : '',
                  ]"
                  @click.stop
                >
                  {{ task.start_date ? formatDate(task.start_date) : "Set date" }}
                </span>
              </template>
              <div class="custom-picker">
                <n-date-picker
                  :value="dateToTs(task.start_date)"
                  type="date"
                  :to="false"
                  panel
                  @update:value="
                    (val) => {
                      task.start_date = formatToYMD(val);
                      closePop(task.id, 'start_date');
                    }
                  "
                />
              </div>
            </n-popover>

            <!-- End Date -->
            <n-popover
              :show="isPopOpen(task.id, 'end_date')"
              trigger="click"
              placement="bottom-start"
              :show-arrow="false"
              style="border-radius: 12px; padding: 0; overflow: hidden"
              @update:show="(val) => (openPop[`${task.id}_end_date`] = val)"
            >
              <template #trigger>
                <span
                  class="fs-13 cursor-pointer rounded-3 date-trigger"
                  :class="[
                    task.end_date ? 'text-dark' : 'text-mute',
                    isPopOpen(task.id, 'end_date') ? 'bg-active' : '',
                  ]"
                  @click.stop
                >
                  {{ task.end_date ? formatDate(task.end_date) : "Set date" }}
                </span>
              </template>
              <div class="custom-picker">
                <n-date-picker
                  :value="dateToTs(task.end_date)"
                  type="date"
                  :to="false"
                  panel
                  class="custom-picker"
                  @update:value="
                    (val) => {
                      task.end_date = formatToYMD(val);
                      closePop(task.id, 'end_date');
                    }
                  "
                />
              </div>
            </n-popover>
          </div>

          <p class="fw-semibold mb-2" style="font-size: 18px">{{ task.title }}</p>
          <p class="mb-0 text-mute fs-15">
            {{ task.description || "No description provided" }}
          </p>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  CircleCheckBig,
  CircleDashed,
  Send,
  CircleCheck,
  CircleX,
  X,
  Maximize2,
  Minimize2,
  FileText,
  Plus,
  UserCheck,
  Ghost,
  Users,
  Calendar,
  Filter,
} from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useTaskStore } from "@/stores/user/task";
import { useTeamStore } from "@/stores/user/team";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { notify } from "@/utils/toast";

const route = useRoute();
const router = useRouter();
const toast = notify(router);
const workspace_id = route.params.workspace_id;
const team_id = route.params.team_id;

const taskStore = useTaskStore();
const { getTask } = storeToRefs(taskStore);

const teamStore = useTeamStore();
const { getTeamById } = storeToRefs(teamStore);

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

// create modal
const showCreateTask = ref(false);
const isLoading = ref(false);
const teamMembers = ref([]);

// create form popover states
const showStatusPop = ref(false);
const showPriorityPop = ref(false);
const showTypePop = ref(false);
const showAssigneePop = ref(false);

// task detail modal
const showTaskModal = ref(false);
const selectedTask = ref(null);
const showActivity = ref(false);
const showDetailStatusPop = ref(false);
const showDetailPriorityPop = ref(false);
const showDetailTypePop = ref(false);
const showDetailStartDatePop = ref(false);
const showDetailEndDatePop = ref(false);
const taskMessage = ref("");

// card inline popover states
const openPop = ref({});

const isPopOpen = (taskId, field) => !!openPop.value[`${taskId}_${field}`];
const closePop = (taskId, field) => {
  openPop.value[`${taskId}_${field}`] = false;
};

const openTaskModal = (task) => {
  selectedTask.value = { ...task };
  showActivity.value = false;
  showTaskModal.value = true;
};

const activeTab = ref("");

const handleTabClick = (status) => {
  activeTab.value = status;
  taskStore.getTaskByTeamStore(workspace_id, team_id, status);
};

const defaultForm = () => ({
  title: "",
  description: "",
  type: "task",
  status: "todo",
  priority: "low",
  assignee: null,
  date_range: null,
});

const form = ref(defaultForm());

const formatToYMD = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateToTs = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).getTime();
};

const handleCreateTask = async () => {
  if (!form.value.title.trim()) return;
  const payload = {
    ...form.value,
    start_date: formatToYMD(form.value.date_range?.[0]),
    end_date: formatToYMD(form.value.date_range?.[1]),
  };
  try {
    isLoading.value = true;
    await taskStore.createTask(workspace_id, team_id, payload);
    showCreateTask.value = false;
    form.value = defaultForm();
    await taskStore.getTaskByTeamStore(workspace_id, team_id);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await teamStore.getTeamByIdStore(workspace_id, team_id);
  await taskStore.getTaskByTeamStore(workspace_id, team_id);
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

// Group activities by date for the activity panel
const groupedActivities = computed(() => {
  if (!selectedTask.value?.activities) return [];
  const groups = {};
  for (const act of selectedTask.value.activities) {
    const dateKey = formatDate(act.date);
    if (!groups[dateKey]) groups[dateKey] = { date: dateKey, items: [] };
    groups[dateKey].items.push(act);
  }
  return Object.values(groups);
});

const actTagClass = (action) => {
  const map = {
    create: "act-tag-create",
    assign: "act-tag-assign",
    update: "act-tag-update",
  };
  return map[action?.toLowerCase()] || "act-tag-update";
};

const actTagIcon = (action) => {
  const map = {
    create: Plus,
    assign: UserCheck,
    update: Send,
  };
  return map[action?.toLowerCase()] || Send;
};

const statusConfig = {
  todo: { icon: CircleCheckBig, bg: "bg-blue", text: "text-blue", label: "To Do" },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-orange",
    text: "text-orange",
    label: "In Progress",
  },
};

const statusConfigFull = {
  todo: { icon: CircleCheckBig, bg: "bg-blue", text: "text-blue", label: "To Do" },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-orange",
    text: "text-orange",
    label: "In Progress",
  },
  submitted: { icon: Send, bg: "bg-purple", text: "text-purple", label: "Submitted" },
  approved: { icon: CircleCheck, bg: "bg-green", text: "text-green", label: "Approved" },
  rejected: { icon: CircleX, bg: "bg-red", text: "text-danger", label: "Rejected" },
};

const priorityConfig = {
  low: { bg: "bg-gray", text: "text-dark", fill: "#171717" },
  medium: { bg: "bg-orange", text: "text-orange", fill: "#FF8D28" },
  high: { bg: "bg-red", text: "text-danger", fill: "#FF383C" },
  urgent: { bg: "bg-purple", text: "text-purple", fill: "#6155F5" },
};

const typeConfig = {
  bug: { bg: "bg-red", text: "text-danger", fill: "#FF383C" },
  task: { bg: "bg-blue", text: "text-blue", fill: "#0088FF" },
  feature: { bg: "bg-aqua", text: "text-aqua", fill: "#00C3D0" },
  improvement: { bg: "bg-purple", text: "text-purple", fill: "#6155F5" },
};
</script>

<style scoped>
.date-trigger {
  display: inline-block;
  padding: 4px 0px;
  border-radius: 8px;
  transition: background 0.2s ease, padding-left 0.2s ease, padding-right 0.2s ease;
}

.date-trigger.bg-active {
  background: #f5f5f5;
  padding: 4px 10px;
}

/* ── Tab styles ── */
.tab-title {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 99px;
  padding: 6px 11.5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
}
.tab-info {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 99px;
  padding: 5px 11px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-transform: capitalize;
  white-space: nowrap;
}
.tab-dark {
  background: #171717;
  color: #fff;
  font-weight: 500 !important;
}

/* ── Meta grids (cards) ── */
.meta-grid-modal {
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: auto auto;
  gap: 6px 30px;
  align-items: center;
  width: fit-content;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: auto auto;
  gap: 6px 24px;
  align-items: center;
  width: fit-content;
}

.task-detail-modal {
  border-radius: 16px;
  overflow: hidden;
  width: 780px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.task-detail-modal.modal-expanded {
  width: 1000px;
}

.detail-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e4e4e7;
  flex-shrink: 0;
}

.detail-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.detail-main {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.detail-main.with-activity {
  border-right: 1px solid #e4e4e7;
}

.detail-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.detail-scroll::-webkit-scrollbar {
  appearance: none;
  display: none;
}

.detail-activity {
  width: 300px;
  max-width: 300px;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.activity-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.detail-bottombar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-top: 1px solid #e4e4e7;
  flex-shrink: 0;
}

/* ── Detail meta rows ── */
.detail-meta-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-meta-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #888;
  width: 110px;
  flex-shrink: 0;
}

/* ── Attachment box ── */
.attach-upload-box {
  border: 1px solid #e4e4e7;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.attach-upload-box:hover {
  border-color: #bbb;
}

.attach-pdf-icon {
  width: 32px;
  height: 32px;
  background: #fff0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Message textarea ── */
.msg-textarea {
  width: 100%;
  min-height: 100px;
  resize: vertical;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  font-family: inherit;
  color: #171717;
  outline: none;
  transition: border-color 0.15s;
}
.msg-textarea:focus {
  border-color: #888;
}

/* ── Activity panel ── */
.activity-date-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #171717;
  background: #fff;
  border-radius: 99px;
  padding: 4px 10px;
  width: fit-content;
  margin-bottom: 10px;
  border: 1px solid #e4e4e7;
}
.activity-card {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 10px;
}
.act-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 99px;
  padding: 3px 9px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: capitalize;
}
.act-tag-create {
  background: #c2eecd;
  color: #34c759;
}
.act-tag-assign {
  background: #b2dbff;
  color: #0088ff;
}
.act-tag-update {
  background: #ffddbe;
  color: #ff8d28;
}

.act-note {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 7px 10px;
  font-size: 14px;
  color: #171717;
  border-radius: 12px !important;
}

/* ── Default avatar small ── */
.default-avatar-sm {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: #555;
  flex-shrink: 0;
}

/* ── Activity slide transition ── */
.slide-activity-enter-active {
  transition: max-width 0.25s ease, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.slide-activity-leave-active {
  transition: max-width 0.3s ease, opacity 0.2s cubic-bezier(0.4, 0, 1, 1);
  overflow: hidden;
}

.slide-activity-enter-from,
.slide-activity-leave-to {
  max-width: 0 !important;
  opacity: 0;
}

.slide-activity-enter-to,
.slide-activity-leave-from {
  max-width: 300px;
  opacity: 1;
}

/* ── Scrollbar ── */
:deep(.n-scrollbar-rail.n-scrollbar-rail--vertical) {
  right: -100px !important;
}

/* ── Base input ── */
.base-input {
  border: 1.5px solid #e4e4e7;
  transition: border-color 0.2s ease;
  box-shadow: none !important;
}

.base-input:focus {
  border-color: grey !important;
  box-shadow: none !important;
  outline: none !important;
}

/* ── Custom date picker ── */
.custom-picker :deep(.n-input) {
  --n-border-hover: 1px solid gray !important;
  --n-border-focus: 1px solid gray !important;
  --n-box-shadow-focus: 0 !important;
  border-radius: 8px !important;
}
.custom-picker :deep(.n-input__input-el) {
  caret-color: #000000 !important;
}
.custom-picker :deep(.n-button--default-type) {
  color: #171717 !important;
  background: #f5f5f5 !important;
  border-radius: 8px !important;
  --n-border-hover: 1px solid gray !important;
  --n-border-focus: 1px solid gray !important;
  --n-border-pressed: 1px solid gray !important;
  --n-text-color-hover: #333 !important;
  --n-color-hover: #f5f5f5 !important;
}
.custom-picker :deep(.n-button--primary-type) {
  background: #171717 !important;
  border-color: #171717 !important;
  color: #fff !important;
  border-radius: 8px !important;
}
.custom-picker :deep(.n-button--primary-type:hover) {
  background: #171717 !important;
  border-color: #171717 !important;
  color: #fff !important;
}
.custom-picker :deep(.n-date-panel) {
  --n-item-color-active: #171717 !important;
  --n-item-color-covered: rgba(23, 23, 23, 0.08) !important;
  --n-item-text-color-active: #fff !important;
  --n-item-color-hover: rgba(23, 23, 23, 0.06) !important;
  --n-item-color-included: rgba(23, 23, 23, 0.08) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}
.custom-picker :deep(.n-date-panel-month-calendar__picker-col) {
  height: 185px !important;
  overflow: hidden !important;
}
.custom-picker :deep(.n-date-panel-month-calendar__padding) {
  height: 0 !important;
  min-height: 0 !important;
}

.tab-default {
  background-color: #ffffff !important;
  color: #171717 !important;
}

.bg-blue-active {
  background-color: #0088ff !important;
  color: #b2dbff !important;
}

.bg-orange-active {
  background-color: #ff8d28 !important;
  color: #ffddbe !important;
}

.bg-purple-active {
  background-color: #6155f5 !important;
  color: #cfccfc !important;
}
.bg-green-active {
  background-color: #34c759 !important;
  color: #c2eecd !important;
}
.bg-red-active {
  background-color: #ff383c !important;
  color: #ffc3c4 !important;
}
</style>
