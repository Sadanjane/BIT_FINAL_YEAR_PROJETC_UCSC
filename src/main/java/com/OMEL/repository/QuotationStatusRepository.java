package com.OMEL.repository;

import com.OMEL.model.QuatationReqStatus;
import com.OMEL.model.QuatationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationStatusRepository extends JpaRepository<QuatationStatus, Integer> {

}
