<template>
  <div class="pt-3 pb-2 bg-body pe-3">
    <div class="pt-2">
      <VCalendar
        v-model="selectedDate"
        expanded
        title-position="left"
        :attributes="attrs"
        :masks="{ weekdays: 'WWW' }"
      >
        <template #footer>
          <n-divider style="margin: 10px 0; --n-color: #e4e4e7" />
          <div
            class="d-flex align-items-center justify-content-between bg-white px-4 pb-2"
            style="border-radius: 16px"
          >
            <p class="mb-0 fs-17">Time</p>
            <p class="mb-0 fs-16 rounded-pill bg-accent" style="padding: 5px 12px">
              {{ currentTime }}
            </p>
          </div>
        </template>
      </VCalendar>
    </div>

    <div class="">
      <template v-if="taskStore.summaryLoading">
        <CompletionSkeleton />
      </template>
      <template v-else>
        <h5
          class="text-dark fw-semibold position-sticky bg-body top-0 pt-4 pb-3 z-3"
          style="font-size: 18px"
        >
          My Task completion
        </h5>
        <div class="d-flex flex-column gap-3">
          <div
            class="d-flex justify-content-between align-items-center bg-white p-3 rounded-card"
          >
            <div>
              <h6 class="mb-2 fw-semibold fs-15">Task completed</h6>
              <h6 class="mb-0 fs-14 text-mute">
                {{ getSummaryTask.status?.approved + getSummaryTask.status?.rejected }} /
                {{ getSummaryTask.total_tasks }}
              </h6>
            </div>
            <div>
              <n-progress
                type="circle"
                :percentage="completedPercentage"
                :stroke-width="13"
                style="width: 75px"
                class="my-progress"
                color="#34C759"
              />
            </div>
          </div>
          <div
            class="d-flex justify-content-between align-items-center bg-white p-3 rounded-card"
          >
            <div>
              <h6 class="mb-2 fw-semibold fs-15">Task submitted</h6>
              <h6 class="mb-0 fs-14 text-mute">
                {{ getSummaryTask.status?.submitted }} /
                {{ getSummaryTask.total_tasks }}
              </h6>
            </div>
            <div>
              <n-progress
                type="circle"
                :percentage="submittedPercentage"
                :stroke-width="13"
                style="width: 75px"
                class="my-progress"
                color="#6155F5"
              />
            </div>
          </div>
          <div class="rounded-card d-flex justify-content-between gap-3">
            <div class="bg-white p-2 rounded-card gap-3 w-50">
              <div
                class="d-flex justify-content-between align-items-center bg-accent w-100 p-2 rounded-btn mb-2"
              >
                <p class="mb-0 fs-14 text-dark">Approved</p>
                <p class="mb-0 fs-13 text-mute">
                  {{ getSummaryTask.status?.approved }} / {{ getSummaryTask.total_tasks }}
                </p>
              </div>
              <div class="d-flex align-items-center gap-2 px-1">
                <n-progress
                  type="line"
                  :percentage="approvedPercentage"
                  color="#34C759"
                  :height="5"
                  :show-indicator="false"
                  processing
                />
                <span class="fs-13 text-green">{{ approvedPercentage }}%</span>
              </div>
            </div>
            <div class="bg-white p-2 rounded-card gap-3 w-50">
              <div
                class="d-flex justify-content-between align-items-center bg-accent w-100 p-2 rounded-btn mb-2"
              >
                <p class="mb-0 fs-14 text-dark">Rejected</p>
                <p class="mb-0 fs-13 text-mute">
                  {{ getSummaryTask.status?.rejected }} / {{ getSummaryTask.total_tasks }}
                </p>
              </div>
              <div class="d-flex align-items-center gap-2 px-1">
                <n-progress
                  type="line"
                  :percentage="rejectedPercentage"
                  color="#FF383C"
                  :height="5"
                  :show-indicator="false"
                  processing
                />
                <span class="fs-13 text-danger">{{ rejectedPercentage }}%</span>
              </div>
            </div>
          </div>
          <div class="bg-white p-3 rounded-card">
            <h6 class="mb-3 fs-15 fw-semibold">Priority's tasks</h6>
            <div class="d-flex flex-column gap-3">
              <div class="d-flex justify-content-between">
                <p class="mb-0 fs-13">
                  <Circle size="10" fill="#6155F5" stroke-width="0" class="me-1" /> Urgent
                </p>
                <p class="mb-0 fs-13 text-mute">
                  {{ getSummaryTask.priority?.urgent }} / {{ getSummaryTask.total_tasks }}
                </p>
              </div>
              <div class="d-flex justify-content-between">
                <p class="mb-0 fs-13">
                  <Circle size="10" fill="#FF383C" stroke-width="0" class="me-1" /> High
                </p>
                <p class="mb-0 fs-13 text-mute">
                  {{ getSummaryTask.priority?.high }} / {{ getSummaryTask.total_tasks }}
                </p>
              </div>
              <div class="d-flex justify-content-between">
                <p class="mb-0 fs-13">
                  <Circle size="10" fill="#FF8D28" stroke-width="0" class="me-1" /> Medium
                </p>
                <p class="mb-0 fs-13 text-mute">
                  {{ getSummaryTask.priority?.medium }} / {{ getSummaryTask.total_tasks }}
                </p>
              </div>
              <div class="d-flex justify-content-between">
                <p class="mb-0 fs-13">
                  <Circle size="10" fill="#171717" stroke-width="0" class="me-1" /> Low
                </p>
                <p class="mb-0 fs-13 text-mute">
                  {{ getSummaryTask.priority?.low }} / {{ getSummaryTask.total_tasks }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- My Tasks -->
      <template v-if="taskStore.myTaskLoading">
        <MyTaskSkeleton />
      </template>
      <template v-else>
        <h5 class="text-dark fw-semibold my-3" style="font-size: 18px">My Task</h5>
        <div class="d-flex flex-column gap-3 pb-2">
          <n-empty
            v-if="getMyTask.length === 0"
            description="No Data"
            class="mt-3"
            style="--n-icon-size: 40px; font-size: 13px"
          />
          <div
            v-else
            v-for="task in getMyTask"
            :key="task.id"
            class="task-card"
            @click="openTaskModal(task)"
          >
            <div class="d-flex align-items-center gap-2">
              <!-- No assignee -->
              <template v-if="!task.assigned_to?.user_id">
                <img
                  src="../../assets/image/default-avatar.png"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-medium text-mute fs-13">No assignee</span>
              </template>

              <!-- Self-assigned: the person who assigned IS the person assigned to -->
              <template
                v-else-if="task.assigned_by?.user_id === task.assigned_to?.user_id"
              >
                <img
                  :src="task.assigned_to?.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-semibold fs-13">{{ task.assigned_to?.name }}</span>
                <span class="fw-bold text-mute fs-12">·</span>
                <span class="text-mute fs-13">Self-assigned the task</span>
              </template>

              <!-- Someone else assigned to a user -->
              <template v-else>
                <img
                  :src="task.assigned_by?.avatar"
                  class="rounded-circle object-fit-cover"
                  style="width: 30px; height: 30px"
                />
                <span class="fw-semibold fs-13">{{ task.assigned_by?.name }}</span>
                <span class="fw-bold text-mute fs-12">·</span>
                <span
                  v-if="task.assigned_to?.user_id === getMe.user_id"
                  class="text-mute fs-13"
                  >Assigned to you</span
                >
                <span v-else class="text-mute fs-13"
                  >Assigned to {{ task.assigned_to?.name }}</span
                >
              </template>
            </div>

            <div class="d-flex flex-column gap-1">
              <div class="task-meta-row">
                <span class="d-flex align-items-center gap-1 fs-14 text-mute"
                  ><Ghost size="15" /> Priority</span
                >
                <n-popover
                  :show="isPopOpen(task.id, 'priority')"
                  trigger="click"
                  placement="bottom-start"
                  :show-arrow="false"
                  style="border-radius: 12px; padding: 6px; width: 120px"
                  @update:show="(val) => (openPop[`${task.id}_priority`] = val)"
                >
                  <template #trigger>
                    <span
                      class="priority-badge"
                      :class="[
                        priorityConfig[task.priority]?.bg,
                        priorityConfig[task.priority]?.text,
                      ]"
                      @click.stop
                    >
                      <Circle
                        size="9"
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
                        handleUpdateTask(task, true);
                      "
                    >
                      <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                      {{ key }}
                    </div>
                  </div>
                </n-popover>
              </div>

              <div class="task-meta-row">
                <span class="d-flex align-items-center gap-1 fs-14 text-mute"
                  ><Calendar size="15" /> Deadline</span
                >
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
                      class="fs-13 cursor-pointer date-trigger"
                      @click.stop
                      :class="[
                        task.end_date ? 'text-dark fw-medium' : 'text-mute',
                        isPopOpen(task.id, 'end_date') ? 'bg-active' : '',
                      ]"
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
                      @update:value="
                        (val) => {
                          task.end_date = formatToYMD(val);
                          closePop(task.id, 'end_date');
                          handleUpdateTask(task, true);
                        }
                      "
                    />
                  </div>
                </n-popover>
              </div>
            </div>

            <p class="task-title mb-2 mt-2">{{ task.title }}</p>
            <p class="task-desc mb-0">
              {{ task.description || "No description provided" }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <n-modal v-model:show="showTaskModal" :mask-closable="true">
      <div
        v-if="selectedTask"
        class="bg-white task-detail-modal"
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
          <div class="detail-main" :class="{ 'with-activity': showActivity }">
            <div class="detail-scroll">
              <!-- Assignee row -->
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center gap-2">
                  <!-- No assignee -->
                  <template v-if="!selectedTask.assigned_to?.user_id">
                    <img
                      src="../../assets/image/default-avatar.png"
                      class="rounded-circle object-fit-cover"
                      style="width: 30px; height: 30px"
                    />
                    <span class="fw-medium text-mute fs-13">No assignee</span>
                  </template>

                  <!-- Self-assigned: the person who assigned IS the person assigned to -->
                  <template
                    v-else-if="
                      selectedTask.assigned_by?.user_id ===
                      selectedTask.assigned_to?.user_id
                    "
                  >
                    <img
                      :src="selectedTask.assigned_to?.avatar"
                      class="rounded-circle object-fit-cover"
                      style="width: 30px; height: 30px"
                    />
                    <span class="fw-semibold fs-13">{{
                      selectedTask.assigned_to?.name
                    }}</span>
                    <span class="fw-bold text-mute fs-12">·</span>
                    <span class="text-mute fs-13">Self-assigned the task</span>
                  </template>

                  <!-- Someone else assigned to a user -->
                  <template v-else>
                    <img
                      :src="selectedTask.assigned_by?.avatar"
                      class="rounded-circle object-fit-cover"
                      style="width: 30px; height: 30px"
                    />
                    <span class="fw-semibold fs-13">{{
                      selectedTask.assigned_by?.name
                    }}</span>
                    <span class="fw-bold text-mute fs-12">·</span>
                    <span
                      v-if="selectedTask.assigned_to?.user_id === getMe.user_id"
                      class="text-mute fs-13"
                      >Assigned to you</span
                    >
                    <span v-else class="text-mute fs-13"
                      >Assigned to {{ selectedTask.assigned_to?.name }}</span
                    >
                  </template>
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
                        handleUpdateTask(selectedTask, true);
                      "
                    >
                      <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                      {{ key }}
                    </div>
                  </div>
                </n-popover>
              </div>

              <!-- Meta rows -->
              <div class="detail-meta-rows mb-3">
                <div class="detail-meta-row">
                  <span class="detail-meta-label"><CircleDashed size="14" /> Status</span>
                  <n-popover
                    trigger="click"
                    placement="bottom-start"
                    v-model:show="showDetailStatusPop"
                    :show-arrow="false"
                    :disabled="isStatusLocked(selectedTask.status)"
                    style="border-radius: 12px; padding: 6px; width: 160px"
                  >
                    <template #trigger>
                      <span
                        class="tab-info w-fit fw-medium"
                        :class="[
                          statusConfigFull[selectedTask.status]?.bg,
                          statusConfigFull[selectedTask.status]?.text,
                          isStatusLocked(selectedTask.status)
                            ? 'cursor-default'
                            : 'cursor-pointer',
                        ]"
                        @click.stop
                      >
                        <component
                          :is="statusConfigFull[selectedTask.status]?.icon"
                          size="16"
                        />
                        {{ statusConfigFull[selectedTask.status]?.label }}
                      </span>
                    </template>
                    <div>
                      <div
                        v-for="(cfg, key) in statusConfig"
                        :key="key"
                        class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                        @click="
                          selectedTask.status = key;
                          showDetailStatusPop = false;
                          handleUpdateTask(selectedTask, true);
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
                          handleUpdateTask(selectedTask, true);
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
                  <n-popover
                    trigger="click"
                    placement="bottom-start"
                    v-model:show="showDetailAssigneePop"
                    :disabled="
                      !canChangeAssigneeOnUpdate(selectedTask) ||
                      isAssigneeLocked(selectedTask.status)
                    "
                    :show-arrow="false"
                    style="border-radius: 12px; padding: 6px; width: fit-content"
                  >
                    <template #trigger>
                      <span
                        class="d-flex align-items-center gap-2 fs-13"
                        :class="
                          canChangeAssigneeOnUpdate(selectedTask) &&
                          !isAssigneeLocked(selectedTask.status)
                            ? 'cursor-pointer'
                            : 'cursor-default'
                        "
                        @click.stop
                      >
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
                          <p class="mb-0">
                            {{ selectedTask.assigned_to.name }}
                          </p>
                          <span
                            v-if="selectedTask.assigned_to.user_id === getMe.user_id"
                            class="text-secondary fs-11"
                            >(You)</span
                          >
                        </template>
                      </span>
                    </template>
                    <div class="d-flex flex-column gap-1">
                      <div
                        v-if="canChangeAssignee"
                        class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                        :class="!selectedTask.assigned_to?.user_id ? 'bg-accent' : ''"
                        @click="
                          selectedTask.assigned_to = null;
                          showDetailAssigneePop = false;
                          handleUpdateTask(selectedTask, true, true);
                        "
                      >
                        <img
                          src="../../assets/image/default-avatar.png"
                          class="rounded-circle"
                          style="width: 22px; height: 22px"
                        />
                        <span class="text-mute">No Assignee</span>
                      </div>

                      <div
                        v-for="member in getAssigneeOptions"
                        :key="member.user_id"
                        class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                        :class="
                          selectedTask.assigned_to?.user_id === member.user_id
                            ? 'bg-accent'
                            : ''
                        "
                        @click="
                          selectedTask.assigned_to = member;
                          selectedTask.assigned_by = getMe;
                          showDetailAssigneePop = false;
                          handleUpdateTask(selectedTask, true, true);
                        "
                      >
                        <img
                          :src="member.avatar"
                          class="rounded-circle object-fit-cover"
                          style="width: 22px; height: 22px"
                        />
                        <n-ellipsis
                          style="max-width: 80px"
                          :tooltip="{
                            keepAliveOnHover: false,
                            style: { pointerEvents: 'none' },
                          }"
                        >
                          {{ member.name }}
                        </n-ellipsis>
                        <span
                          v-if="member.user_id === getMe.user_id"
                          class="text-mute fs-11"
                          >(You)</span
                        >
                        <template v-else>
                          <span v-if="member.role === 'moderator'" class="text-mute fs-11"
                            >(Moderator)</span
                          >
                        </template>
                      </div>
                    </div>
                  </n-popover>
                </div>

                <div class="detail-meta-row mt-2">
                  <span class="detail-meta-label"><Calendar size="14" /> Start date</span>
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
                            handleUpdateTask(selectedTask, true);
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
                            handleUpdateTask(selectedTask, true);
                          }
                        "
                      />
                    </div>
                  </n-popover>
                </div>
              </div>

              <div class="d-flex flex-column">
                <textarea
                  v-model="selectedTask.title"
                  class="detail-title-input fw-bold mb-2"
                  rows="1"
                  @blur="handleUpdateTask(selectedTask)"
                  @input="autoResize"
                  placeholder="Task Title"
                />
                <textarea
                  v-model="selectedTask.description"
                  placeholder="No description provided"
                  class="detail-desc-input fs-13 text-mute mb-4"
                  rows="1"
                  @blur="handleUpdateTask(selectedTask)"
                  @input="autoResize"
                />
              </div>

              <!-- File/Link Attachment -->
              <p class="fw-semibold fs-15 mb-2">
                File attachment <Link size="15" class="ms-1" />
              </p>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*,application/pdf"
                class="d-none"
                @change="handleFileChange"
              />
              <div class="attach-upload-box mb-4" @click="triggerFileInput">
                <template v-if="!selectedFile">
                  <div class="attach-pdf-icon">
                    <FileText size="18" color="#e24b4a" />
                  </div>
                  <span class="fs-13 text-mute">Embed a PDF or Image</span>
                </template>

                <template v-else>
                  <!-- Image -->
                  <div
                    v-if="selectedFile.type.startsWith('image/')"
                    class="attach-thumb"
                    @click.stop
                  >
                    <n-tooltip
                      placement="bottom"
                      trigger="hover"
                      :show-arrow="false"
                      :keep-alive-on-hover="false"
                      :style="{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '8px',
                      }"
                    >
                      <template #trigger>
                        <n-image
                          :src="filePreviewUrl"
                          width="32"
                          height="32"
                          object-fit="cover"
                          style="border-radius: 6px; display: block"
                          show-toolbar-tooltip
                        />
                      </template>
                      Preview Image
                    </n-tooltip>
                  </div>

                  <!-- PDF -->
                  <n-tooltip
                    v-else
                    placement="bottom"
                    trigger="hover"
                    :show-arrow="false"
                    :keep-alive-on-hover="false"
                    :style="{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px' }"
                  >
                    <template #trigger>
                      <div
                        class="attach-pdf-icon cursor-pointer bg-blue"
                        @click.stop="openFilePreview"
                      >
                        <FileText size="18" color="#0088ff" />
                      </div>
                    </template>
                    Open PDF
                  </n-tooltip>

                  <span class="fs-13 text-dark fw-medium flex-grow-1 text-truncate">
                    {{ selectedFile.name }}
                  </span>
                  <button type="button" class="icon-action-btn" @click.stop="removeFile">
                    <X size="14" />
                  </button>
                </template>
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
            <div v-if="showActivity" class="detail-activity text-nowrap">
              <p
                class="fw-semibold fs-14 position-sticky z-3 top-0 mb-0 pt-4 pb-3"
                style="padding-left: 16px"
              >
                Task activity
              </p>
              <div class="activity-scroll pt-0">
                <template
                  v-if="selectedTask.activities && selectedTask.activities.length"
                >
                  <template v-for="(group, gi) in groupedActivities" :key="gi">
                    <div class="activity-date-label">
                      <Calendar size="13" />
                      {{ group.date }}
                    </div>
                    <div v-for="(act, ai) in group.items" :key="ai" class="activity-card">
                      <span class="act-tag" :class="actTagClass(act.action)">
                        <component :is="actTagIcon(act.action)" size="11" />
                        {{ act.action }}
                      </span>
                      <div class="d-flex align-items-center justify-content-between mb-2">
                        <div class="d-flex align-items-center gap-2">
                          <img
                            :src="act.user.avatar"
                            class="rounded-circle object-fit-cover"
                            style="width: 24px; height: 24px"
                          />
                          <span class="fw-semibold fs-13">{{ act.user?.name }}</span>
                        </div>
                        <span class="fs-11 text-mute">{{ act.time }}</span>
                      </div>
                      <div class="act-note">{{ act.note }}</div>
                    </div>
                  </template>
                </template>

                <template v-else>
                  <n-empty
                    description="No Data"
                    class="mt-5"
                    style="--n-icon-size: 35px; font-size: 12px"
                  />
                </template>
              </div>
            </div>
          </transition>
        </div>

        <!-- Modal Bottom Bar -->
        <div class="detail-bottombar">
          <span class="fw-semibold fs-5">Submission</span>
          <button
            class="btn bg-btn rounded-4 py-2 px-3 d-flex align-items-center gap-2"
            :disabled="isLoading"
            @click="handleSubmit(selectedTask)"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
            <Send v-else :size="16" />
            {{ isLoading ? "Submitting..." : "Submit" }}
          </button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { Calendar as VCalendar } from "v-calendar";
import "v-calendar/style.css";
import {
  Circle,
  Ghost,
  Calendar,
  Users,
  CircleDashed,
  CircleCheckBig,
  CircleCheck,
  CircleX,
  Send,
  X,
  Expand,
  Shrink,
  FileText,
  Plus,
  UserCheck,
  Link,
  MessageCircle,
  Eye,
} from "lucide-vue-next";
import { useTaskStore } from "@/stores/user/task";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useTeamStore } from "@/stores/user/team";
import { notify } from "@/utils/toast";
import { useAuthStore } from "@/stores/auth";
import CompletionSkeleton from "../Skeleton/CompletionSkeleton.vue";
import MyTaskSkeleton from "../Skeleton/MyTaskSkeleton.vue";
import { useSubmissionStore } from "@/stores/user/submission.js";

const route = useRoute();
const router = useRouter();
const toast = notify(router);
const workspace_id = computed(() => route.params.workspace_id);
const team_id = computed(() => route.params.team_id);

const taskStore = useTaskStore();
const { getTask, getTaskActivity, getSummaryTask, getMyTask } = storeToRefs(taskStore);

const teamStore = useTeamStore();
const { getMember, getTeamById } = storeToRefs(teamStore);

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

const submissionStore = useSubmissionStore();

onMounted(async () => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  await Promise.all([
    await taskStore.getSummaryTaskStore(workspace_id.value, team_id.value),
    await taskStore.getMyTaskStore(workspace_id.value, team_id.value),
  ]);
});

// Access your data source
const summary = computed(() => getSummaryTask.value || {});
const total = computed(() => summary.value.total_tasks || 0);

// Calculate percentages
const completedPercentage = computed(() => {
  if (total.value === 0) return 0;
  const count =
    (summary.value.status?.approved || 0) + (summary.value.status?.rejected || 0);
  return Math.round((count / total.value) * 100);
});

const submittedPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.status?.submitted || 0) / total.value) * 100);
});

const approvedPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.status?.approved || 0) / total.value) * 100);
});

const rejectedPercentage = computed(() => {
  if (total.value === 0) return 0;
  return Math.round(((summary.value.status?.rejected || 0) / total.value) * 100);
});

// ── File attachment ──
const fileInputRef = ref(null);
const selectedFile = ref(null);
const filePreviewUrl = ref(null);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const isValid = file.type === "application/pdf" || file.type.startsWith("image/");
  if (!isValid) {
    toast.error("Only image or PDF files are allowed");
    e.target.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size must be 5MB or less");
    e.target.value = "";
    return;
  }

  selectedFile.value = file;
  e.target.value = "";
};

const removeFile = () => {
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
    filePreviewUrl.value = null;
  }
  selectedFile.value = null;
};

// Generate object URL for images only (used by n-image thumbnail)
watch(selectedFile, (newFile) => {
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
    filePreviewUrl.value = null;
  }
  if (newFile && newFile.type.startsWith("image/")) {
    filePreviewUrl.value = URL.createObjectURL(newFile);
  }
});

// PDF only — open in new tab
const openFilePreview = () => {
  if (!selectedFile.value || selectedFile.value.type !== "application/pdf") return;
  const url = URL.createObjectURL(selectedFile.value);
  window.open(url, "_blank");
};

const handleSubmit = async (task) => {
  if (!task) return;

  if (!selectedFile.value) {
    toast.error("Add attach a file before submitting");
    return;
  }

  if (!taskMessage.value.trim()) {
    toast.error("Add a message before submitting");
    return;
  }

  const formData = new FormData();
  formData.append("message", taskMessage.value);
  if (selectedFile.value) {
    formData.append("file", selectedFile.value);
  }

  try {
    isLoading.value = true;
    await submissionStore.submitTask(
      workspace_id.value,
      team_id.value,
      task.id,
      formData
    );

    taskMessage.value = "";
    removeFile();
    await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value);
    await taskStore.getSummaryTaskStore(workspace_id.value, team_id.value, true);
    await taskStore.getMyTaskStore(workspace_id.value, team_id.value, "", true);
    toast.success("Task submitted successfully");
    showTaskModal.value = false;
  } catch (err) {
    toast.error(err.message);
  } finally {
    isLoading.value = false;
  }
};

// ── Calendar ──
const selectedDate = ref(new Date());
const currentTime = ref("");
const attrs = ref([
  { highlight: { color: "gray", fillMode: "solid" }, dates: new Date() },
]);

let timer;
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

onUnmounted(() => {
  clearInterval(timer);
  if (filePreviewUrl.value) URL.revokeObjectURL(filePreviewUrl.value);
});

// ── Task modal state ──
const showTaskModal = ref(false);
const selectedTask = ref(null);
const originalTask = ref(null);
const showActivity = ref(false);
const showDetailStatusPop = ref(false);
const showDetailPriorityPop = ref(false);
const showDetailTypePop = ref(false);
const showDetailStartDatePop = ref(false);
const showDetailEndDatePop = ref(false);
const showDetailAssigneePop = ref(false);
const taskMessage = ref("");
const isLoading = ref(false);

// ── Card popovers ──
const openPop = ref({});
const isPopOpen = (taskId, field) => !!openPop.value[`${taskId}_${field}`];
const closePop = (taskId, field) => {
  openPop.value[`${taskId}_${field}`] = false;
};

const myWorkspaceRole = computed(() => {
  const me = getTeamById.value?.members?.find((m) => m.user_id === getMe.value?.user_id);
  return me?.role ?? "member";
});

const canChangeAssignee = computed(() => {
  return myWorkspaceRole.value === "owner" || myWorkspaceRole.value === "moderator";
});

const canChangeAssigneeOnUpdate = (task) => {
  if (myWorkspaceRole.value === "owner" || myWorkspaceRole.value === "moderator")
    return true;
  return !task.assigned_to?.user_id;
};

const getAssigneeOptions = computed(() => {
  if (myWorkspaceRole.value === "owner") {
    return getTeamById.value.members;
  }
  if (myWorkspaceRole.value === "moderator") {
    return getMember.value;
  }
  return getMember.value.filter((m) => m.user_id === getMe.value?.user_id);
});

const openTaskModal = async (task) => {
  selectedTask.value = { ...task };
  originalTask.value = { ...task };
  showActivity.value = false;
  showTaskModal.value = true;
  await taskStore.getTaskActivityStore(workspace_id.value, team_id.value, task.id);
  selectedTask.value.activities = getTaskActivity.value;

  await nextTick();
  document.querySelectorAll(".detail-title-input, .detail-desc-input").forEach((el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  });
};

const handleUpdateTask = async (task, forceField = null, assigneeChanged = false) => {
  try {
    if (!forceField) {
      const titleChanged = task.title !== originalTask.value?.title;
      const descChanged = task.description !== originalTask.value?.description;
      if (!titleChanged && !descChanged) return;
    }

    const payload = {
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      priority: task.priority,
      start_date: task.start_date,
      end_date: task.end_date,
    };

    if (assigneeChanged) {
      payload.assigned_to = task.assigned_to?.user_id ?? null;
    } else if (originalTask.value?.id === task.id) {
      if (
        (task.assigned_to?.user_id ?? null) !==
        (originalTask.value?.assigned_to?.user_id ?? null)
      ) {
        payload.assigned_to = task.assigned_to?.user_id ?? null;
      }
    }

    await taskStore.updateTask(workspace_id.value, team_id.value, task.id, payload);
    originalTask.value = { ...task };

    await taskStore.getSummaryTaskStore(workspace_id.value, team_id.value, true);
    await taskStore.getMyTaskStore(workspace_id.value, team_id.value, "", true);
    await taskStore.getTaskActivityStore(workspace_id.value, team_id.value, task.id);
    if (selectedTask.value?.id === task.id) {
      selectedTask.value.activities = getTaskActivity.value;
    }
  } catch (error) {
    toast.error(error.message);
    await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value, "", true);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return `${date.getDate()} / ${date.toLocaleString("en-US", {
    month: "short",
  })} / ${date.getFullYear()}`;
};

const formatToYMD = (timestamp) => {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const dateToTs = (dateString) => (dateString ? new Date(dateString).getTime() : null);

const autoResize = (e) => {
  const el = e.target;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
};

const groupedActivities = computed(() => {
  if (!selectedTask.value?.activities) return [];
  const groups = {};
  for (const act of selectedTask.value.activities) {
    const key = formatDate(act.created_at);
    if (!groups[key]) groups[key] = { date: key, items: [] };
    groups[key].items.push({
      action: act.action,
      note: act.message,
      user: act.created_by,
      time: new Date(act.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }
  return Object.values(groups);
});

const actTagClass = (action) => {
  const map = {
    create: "act-tag-create",
    assign: "act-tag-assign",
    submit: "act-tag-submit",
    review: "act-tag-review",
  };
  return map[action?.toLowerCase()];
};

const actTagIcon = (action) => {
  const map = { create: Plus, assign: UserCheck, submit: Send, review: Eye };
  return map[action?.toLowerCase()];
};

const lockedStatuses = ["submitted", "approved", "rejected"];
const isStatusLocked = (status) => lockedStatuses.includes(status);
const isAssigneeLocked = (status) => ["submitted", "approved"].includes(status);

// ── Configs ──
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
.task-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.18s ease, transform 0.15s ease;
  border: 1px solid #f0f0f0;
}
.task-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.task-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 99px;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  text-transform: capitalize;
}
.task-title {
  font-size: 15px;
  font-weight: 700;
  color: #171717;
  line-height: 1.4;
}
.task-desc {
  font-size: 13px;
  color: #a3a3a3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
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
:deep(.vc-container) {
  border: none !important;
  box-shadow: none !important;
  width: 100% !important;
  border-radius: 16px;
}
:deep(.vc-header) {
  margin-bottom: 15px;
}
:deep(.vc-title) {
  font-size: 18px !important;
  background-color: transparent !important;
  font-weight: 600 !important;
}
:deep(.vc-weekday) {
  font-size: 13px !important;
  color: #a3a3a3 !important;
  font-weight: 500 !important;
  text-transform: uppercase;
}
:deep(.vc-weeks) {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}
:deep(.vc-week) {
  min-height: unset !important;
}
:deep(.vc-day-content) {
  font-size: 18px !important;
  font-weight: 400 !important;
  height: 35px !important;
  width: 35px !important;
}
:deep(.vc-day.is-not-in-month) {
  visibility: hidden !important;
}
:deep(.vc-week:last-child) {
  display: none !important;
}
:deep(.vc-arrow) {
  border-radius: 8px !important;
  background-color: transparent !important;
  color: #171717 !important;
}
:deep(.vc-highlight) {
  width: 35px !important;
  height: 35px !important;
  border-radius: 50% !important;
  background-color: #e3e3e3 !important;
  color: #171717 !important;
}
:deep(.vc-day-content.vc-focusable) {
  color: #171717 !important;
}
:deep(.vc-nav-item.is-active) {
  color: white !important;
  background-color: #171717 !important;
  font-weight: 500 !important;
}
:deep(.vc-nav-item) {
  color: #171717 !important;
  font-weight: 500 !important;
}
:deep(.vc-nav-item:focus) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}
:deep(.vc-day-content:focus) {
  box-shadow: 0 0 0 1px #a3a3a3 !important;
}
.my-progress :deep(.n-progress-text) {
  font-size: 14px !important;
  font-weight: bold;
}
</style>
